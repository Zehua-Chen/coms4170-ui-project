import { Injectable } from '@angular/core';
import { filter, map, mergeMap, Observable, OperatorFunction } from 'rxjs';

import {
  collection,
  getDocs,
  addDoc,
  orderBy,
  query,
  where,
  documentId,
  DocumentData,
  CollectionReference,
  Firestore,
  onSnapshot,
  QuerySnapshot,
} from 'firebase/firestore';

import { FirebaseAuthService, UserState } from './firebase-auth.service';
import { FirebaseFirestoreService } from './firebase-firestore.service';

export interface Question {
  title: string;
  weight: number;
  submission?: number[];
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

/**
 * Creates an operator that given a user, return the collection of its quizzes
 * @param firestore
 * @returns
 */
function userQuizzes(
  firestore: Firestore
): OperatorFunction<UserState, CollectionReference<DocumentData>> {
  return (user: Observable<UserState>) => {
    return user
      .pipe(
        filter((user) => user !== null),
        map((user) => `/users/${user!.uid}/quizzes`)
      )
      .pipe(map((path) => collection(firestore, path)));
  };
}

@Injectable({ providedIn: 'root' })
export class QuizService {
  constructor(
    private auth: FirebaseAuthService,
    private firestore: FirebaseFirestoreService
  ) {}

  public getQuizzes(): Observable<Quiz[]> {
    return this.auth.user$.pipe(userQuizzes(this.firestore.firestore)).pipe(
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

          onSnapshot(collection, next, (error) => subcriber.error(error));
          getDocs(collection)
            .then(next)
            .catch((error) => subcriber.error(error));
        });
      })
    );
  }

  public getQuiz(id: string): Observable<Quiz[]> {
    return this.auth.user$.pipe(userQuizzes(this.firestore.firestore)).pipe(
      map((collection) => query(collection, where(documentId(), '==', id))),
      mergeMap((collection) => {
        return new Observable<Quiz[]>((subcriber) => {
          getDocs(collection).then((snapshot) => {
            const quizzes = snapshot.docs.map(
              (doc) =>
                ({
                  id: doc.id,
                  ...doc.data(),
                } as Quiz)
            );

            subcriber.next(quizzes);
          });
        });
      })
    );
  }

  public createDefaultQuiz(): Observable<void> {
    const defaultQuiz: QuizContent = {
      title: 'Default Quiz',
      date: new Date(),
      questions: [
        { title: 'Question 1', weight: 1, solution: [4] },
        { title: 'Question 2', weight: 1, solution: [1, 2] },
        { title: 'Question 3', weight: 1, solution: [3, 4, 5] },
        { title: 'Question 4', weight: 2, solution: [3, 4, 3, 4, 5] },
        { title: 'Question 5', weight: 2, solution: [5, 5, 4, 4, 3, 3, 2] },
        { title: 'Question 6', weight: 3, solution: [2, 7, 6, 5, 2] },
      ],
    };

    return this.auth.user$.pipe(userQuizzes(this.firestore.firestore)).pipe(
      mergeMap((collection) => {
        return new Observable<void>((subcriber) => {
          addDoc(collection, defaultQuiz).then(() => subcriber.complete());
        });
      })
    );
  }
}
