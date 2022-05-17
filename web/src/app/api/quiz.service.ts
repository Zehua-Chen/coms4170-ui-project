import { Injectable } from '@angular/core';
import {
  filter,
  first,
  map,
  pipe,
  concatMap,
  shareReplay,
  Observable,
  OperatorFunction,
} from 'rxjs';

import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  orderBy,
  query,
  DocumentData,
  CollectionReference,
  Firestore,
  onSnapshot,
  QuerySnapshot,
  QueryDocumentSnapshot,
  FirestoreDataConverter,
  DocumentReference,
  DocumentSnapshot,
  setDoc,
} from 'firebase/firestore';

import { arraysEqual } from 'src/app/utils';

import { FirebaseAuthService, UserState } from './firebase-auth.service';
import { FirebaseFirestoreService } from './firebase-firestore.service';

export class Question {
  constructor(
    public title: string,
    public weight: number,
    public submission: number[],
    public solution: number[]
  ) {}
}

export class QuizContent {
  score: number;
  totalScore: number;
  answeredQuestions: number;

  public constructor(
    public title: string,
    public date: Date,
    public questions: Question[]
  ) {
    this.totalScore = this.questions.reduce(
      (score, question) => score + question.weight,
      0
    );

    this.score = this.questions.reduce((score, question) => {
      if (!question.submission) {
        return 0;
      }

      const correct = arraysEqual(question.submission, question.solution)
        ? 1
        : 0;

      return score + correct * question.weight;
    }, 0);

    this.answeredQuestions = this.questions.reduce((count, question) => {
      const answered = question.submission.length > 0 ? 1 : 0;
      return count + answered;
    }, 0);
  }
}

export class Quiz extends QuizContent {
  constructor(
    public id: string,
    title: string,
    date: Date,
    questions: Question[]
  ) {
    super(title, date, questions);
  }

  get content(): QuizContent {
    return new QuizContent(this.title, this.date, this.questions);
  }
}

const quizConverter: FirestoreDataConverter<Quiz> = {
  fromFirestore(snapshot: QueryDocumentSnapshot) {
    const { date, title, questions } = snapshot.data();

    return new Quiz(snapshot.id, title, date.toDate(), questions);
  },
  toFirestore({ id, content }: Quiz): DocumentData {
    let { questions, ...others } = content;
    questions = questions.map((question) => ({ ...question }));

    return { questions, ...others };
  },
};

/**
 * Creates an operator that given a user, return the collection of its quizzes
 * @param firestore
 * @returns
 */
function quizzes(
  firestore: Firestore
): OperatorFunction<UserState, CollectionReference<Quiz>> {
  return pipe(
    filter((user) => user !== null),
    map((user) => `/users/${user!.uid}/quizzes`),
    map((path) => collection(firestore, path).withConverter(quizConverter))
  );
}

/**
 * Creates an operator that given a user, return the quiz with the id
 * @param firestore
 * @returns
 */
function quiz(
  firestore: Firestore,
  id: string
): OperatorFunction<UserState, DocumentReference<Quiz>> {
  return pipe(
    filter((user) => user !== null),
    map((user) => `/users/${user!.uid}/quizzes/${id}`),
    map((path) => doc(firestore, path).withConverter(quizConverter))
  );
}

@Injectable({ providedIn: 'root' })
export class QuizService {
  constructor(
    private auth: FirebaseAuthService,
    private firestore: FirebaseFirestoreService
  ) {}

  /**
   * Returns a stream of quiz list. A new quiz list is emitted when new changes
   * occur on Firestore
   *
   * Guaranteed to emit upon subscription, so long as the user has signed in
   *
   * @returns **Infinite sequence**
   */
  public getQuizzes(): Observable<Quiz[]> {
    return this.auth.user$.pipe(
      quizzes(this.firestore.firestore),
      map((collection) => query(collection, orderBy('date', 'desc'))),
      concatMap((collection) => {
        return new Observable<Quiz[]>((subcriber) => {
          function next(snapshot: QuerySnapshot<DocumentData>) {
            const quizzes = snapshot.docs.map(
              (doc) =>
                ({
                  id: doc.id,
                  ...doc.data(),
                } as Quiz)
            );

            subcriber.next(quizzes);
          }

          return onSnapshot(collection, next, (error) =>
            subcriber.error(error)
          );
        });
      }),
      shareReplay(1)
    );
  }

  /**
   * Guaranteed to emit upon subscription, so long as the user has signed in
   * @param id
   * @returns
   */
  public getQuiz(id: string): Observable<Quiz | undefined> {
    return this.auth.user$.pipe(
      quiz(this.firestore.firestore, id),
      concatMap(
        (quiz) =>
          new Observable<DocumentSnapshot<Quiz>>((subscriber) => {
            return onSnapshot(quiz, (snapshot) => {
              subscriber.next(snapshot);
            });
          })
      ),
      map((snapshot) => snapshot.data()),
      shareReplay(1)
    );
  }

  public setQuiz(id: string, data: Quiz): Observable<void> {
    return this.auth.user$.pipe(
      quiz(this.firestore.firestore, id),
      concatMap((quiz) => setDoc(quiz, data)),
      shareReplay(1),
      first()
    );
  }

  /**
   * Create a default quiz
   *
   * Guaranteed to emit upon subscription, so long as the user has signed in
   *
   * @returns **Finite sequence** that finishes after the quiz has been created
   */
  public createDefaultQuiz(): Observable<void> {
    const defaultQuiz = new Quiz('', 'Default Quiz', new Date(), [
      new Question('Question 1', 1, [], [4]),
      new Question('Question 2', 1, [], [1, 2]),
      new Question('Question 3', 1, [], [3, 4, 5]),
      new Question('Question 4', 2, [], [3, 4, 3, 4, 5]),
      new Question('Question 5', 2, [], [5, 5, 4, 4, 3, 3, 2]),
      new Question('Question 6', 3, [], [2, 7, 6, 5, 2]),
    ]);

    return this.auth.user$.pipe(
      quizzes(this.firestore.firestore),
      concatMap(async (collection) => {
        await addDoc(collection, defaultQuiz);
      }),
      first()
    );
  }

  /**
   * Guaranteed to emit upon subscription, so long as the user has signed in
   * @param id
   * @returns
   */
  public deleteQuiz(id: string): Observable<void> {
    return this.auth.user$.pipe(
      quiz(this.firestore.firestore, id),
      concatMap((quiz) => deleteDoc(quiz)),
      first()
    );
  }
}
