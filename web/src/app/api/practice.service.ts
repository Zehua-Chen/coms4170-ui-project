import { BehaviorSubject, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

import { collection, getDocs, orderBy, query } from 'firebase/firestore';

import { FirebaseFirestoreService } from './firebase-firestore.service';

export interface Practice {
  id: string;
  index: number;
  title: string;
  solution: number[];
}

@Injectable({
  providedIn: 'root',
})
export class PracticeService {
  #lessons$: BehaviorSubject<Practice[]> = new BehaviorSubject<Practice[]>([]);

  get lessons$(): Observable<Practice[]> {
    return this.#lessons$;
  }

  constructor(private firestore: FirebaseFirestoreService) {
    const lessons = collection(this.firestore.firestore, 'practices');
    const lessonsById = query(lessons, orderBy('index'));

    getDocs(lessonsById).then((snapshot) => {
      const lessons = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Practice)
      );

      this.#lessons$.next(lessons);
    });
  }
}
