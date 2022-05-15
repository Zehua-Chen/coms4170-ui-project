import { Injectable } from '@angular/core';
import {
  filter,
  first,
  map,
  pipe,
  mergeMap,
  shareReplay,
  Observable,
  OperatorFunction,
} from 'rxjs';

import {
  collection,
  getDoc,
  getDocs,
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

export interface Question {
  title: string;
  weight: number;
  submission: number[];
  solution: number[];
}

export interface QuizContent {
  title: string;
  date: Date;
  questions: Question[];
}

export interface Quiz extends QuizContent {
  id: string;
}

const quizConverter: FirestoreDataConverter<Quiz> = {
  fromFirestore(snapshot: QueryDocumentSnapshot) {
    const { date, ...others } = snapshot.data();

    return {
      id: snapshot.id,
      date: date.toDate(),
      ...others,
    } as Quiz;
  },
  toFirestore({ id, ...others }: Quiz): DocumentData {
    return {
      ...others,
    };
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

export function quizTotalScore(): OperatorFunction<Quiz | undefined, number> {
  return pipe(
    filter((quiz) => Boolean(quiz)),
    map((quiz) =>
      quiz!.questions.reduce((score, question) => score + question.weight, 0)
    )
  );
}

export function quizScore(): OperatorFunction<Quiz | undefined, number> {
  return pipe(
    filter((quiz) => Boolean(quiz)),
    map((quiz) =>
      quiz!.questions.reduce((score, question) => {
        if (!question.submission) {
          return 0;
        }

        const correct = arraysEqual(question.submission, question.solution)
          ? 1
          : 0;

        return score + correct * question.weight;
      }, 0)
    )
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
      map((collection) => query(collection, orderBy('date'))),
      mergeMap((collection) => {
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
      shareReplay()
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
      mergeMap(
        (quiz) =>
          new Observable<DocumentSnapshot<Quiz>>((subscriber) => {
            return onSnapshot(quiz, (snapshot) => {
              subscriber.next(snapshot);
            });
          })
      ),
      map((snapshot) => snapshot.data()),
      shareReplay()
    );
  }

  public setQuiz(id: string, data: QuizContent): Observable<void> {
    return this.auth.user$.pipe(
      quiz(this.firestore.firestore, id),
      mergeMap((quiz) => setDoc(quiz, data)),
      shareReplay(),
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
    const defaultQuiz: QuizContent = {
      title: 'Default Quiz',
      date: new Date(),
      questions: [
        { title: 'Question 1', weight: 1, submission: [], solution: [4] },
        { title: 'Question 2', weight: 1, submission: [], solution: [1, 2] },
        { title: 'Question 3', weight: 1, submission: [], solution: [3, 4, 5] },
        {
          title: 'Question 4',
          weight: 2,
          submission: [],
          solution: [3, 4, 3, 4, 5],
        },
        {
          title: 'Question 5',
          weight: 2,
          submission: [],
          solution: [5, 5, 4, 4, 3, 3, 2],
        },
        {
          title: 'Question 6',
          weight: 3,
          submission: [],
          solution: [2, 7, 6, 5, 2],
        },
      ],
    };

    return this.auth.user$.pipe(
      quizzes(this.firestore.firestore),
      mergeMap(async (collection) => {
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
      mergeMap((quiz) => deleteDoc(quiz)),
      first()
    );
  }
}
