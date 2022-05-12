import { Observable, BehaviorSubject, of, map } from 'rxjs';
import { Injectable } from '@angular/core';

import { collection, getDocs, orderBy, query } from 'firebase/firestore';

import { FirebaseFirestoreService } from './firebase-firestore.service';

export interface Lesson {
  id: string;
  index: number;
  title: string;
  enabledPositions: 'all' | number[];
  solution: number[];
}

@Injectable({
  providedIn: 'root',
})
export class LessonService {
  #lessons$: BehaviorSubject<Lesson[]> = new BehaviorSubject<Lesson[]>([]);

  public get lessons$(): Observable<Lesson[]> {
    return this.#lessons$;
  }

  constructor(private firestore: FirebaseFirestoreService) {
    const lessons = collection(this.firestore.firestore, 'lessons');
    const lessonsById = query(lessons, orderBy('index'));

    getDocs(lessonsById).then((snapshot) => {
      const lessons = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Lesson)
      );

      this.#lessons$.next(lessons);
    });
  }
}
