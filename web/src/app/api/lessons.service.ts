import { Observable, shareReplay } from 'rxjs';
import { Injectable } from '@angular/core';

import {
  collection,
  orderBy,
  query,
  QuerySnapshot,
  DocumentData,
  onSnapshot,
} from 'firebase/firestore';

import { FirebaseFirestoreService } from './firebase-firestore.service';

export interface Lesson {
  id: string;
  index: number;
  title: string;
  enabledNotes: 'all' | number[];
  solution: number[];
}

@Injectable({
  providedIn: 'root',
})
export class LessonService {
  constructor(private firestore: FirebaseFirestoreService) {}

  /**
   * Guaranteed to emit upon subscription
   * @returns
   */
  public getLessons(): Observable<Lesson[]> {
    return new Observable<Lesson[]>((subscriber) => {
      const lessons = collection(this.firestore.firestore, 'lessons');
      const lessonsById = query(lessons, orderBy('index'));

      function next(snapshot: QuerySnapshot<DocumentData>) {
        const lessons = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Lesson)
        );

        subscriber.next(lessons);
      }

      return onSnapshot(lessons, next);
    }).pipe(shareReplay(1));
  }
}
