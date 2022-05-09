import { Observable, of, delay } from 'rxjs';
import { Injectable } from '@angular/core';

export interface LessonOverview {
  id: number;
  title: string;
}

export interface Lesson {
  id: number;
  note: string;
  position: number;
}

const lessons = [
  {
    id: 1,
    note: 'Do',
    position: 1,
  },
  {
    id: 2,
    note: 'Re',
    position: 2,
  },
  {
    id: 3,
    note: 'Mi',
    position: 3,
  },
  {
    id: 4,
    note: 'Fa',
    position: 4,
  },
  {
    id: 5,
    note: 'So',
    position: 5,
  },
  {
    id: 6,
    note: 'La',
    position: 6,
  },
  {
    id: 7,
    note: 'Ti',
    position: 7,
  },
] as Lesson[];

const lessonOverviews = lessons.map(
  (lesson) => ({ id: lesson.id, title: lesson.note } as LessonOverview)
);

@Injectable({
  providedIn: 'root',
})
export class LessonService {
  public getLessonOverviews(): Observable<LessonOverview[]> {
    return of(lessonOverviews);
  }

  public getLesson(id: number): Observable<Lesson> {
    return of(lessons.find((lesson) => lesson.id === id)!);
  }
}
