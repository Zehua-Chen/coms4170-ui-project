import { Observable, of, delay } from 'rxjs';
import { Injectable } from '@angular/core';

export interface LessonOverview {
  id: number;
  title: string;
}

export interface Lesson {
  id: number;
  title: string;
  note: number;
}

let lessonOverviews = [] as LessonOverview[];

for (let id = 1; id < 100; id++) {
  lessonOverviews.push({ id, title: `${id}` });
}

@Injectable({
  providedIn: 'root',
})
export class LessonService {
  public getLessonOverviews(): Observable<LessonOverview[]> {
    return of(lessonOverviews);
  }

  public getLesson(id: number): Observable<Lesson> {
    return of({ id, title: 'Do', note: 1 });
  }
}
