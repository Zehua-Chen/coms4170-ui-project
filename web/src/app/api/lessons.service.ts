import { Observable, of, delay } from 'rxjs';
import { Injectable } from '@angular/core';

export interface LessonOverview {
  id: number;
  title: string;
}

export interface Lesson {
  id: number;
  title: string;
}

@Injectable()
export class LessonService {
  public getLessonOverviews(): Observable<LessonOverview[]> {
    return of([
      { id: 1, title: 'Do' },
      { id: 2, title: 'Re' },
      { id: 3, title: 'Mi' },
    ]);
  }

  public getLesson(id: number): Observable<Lesson> {
    return of({ id, title: 'Do' });
  }
}
