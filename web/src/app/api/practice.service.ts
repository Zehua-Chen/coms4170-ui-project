import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

export interface PracticeOverview {
  id: number;
  title: string;
}

export interface Practice {
  id: number;
  title: string;
  solution: readonly number[];
}

const practices = [
  {
    id: 1,
    title: 'Practice 1',
    solution: [1, 1, 2, 2, 3, 3],
  },
  {
    id: 2,
    title: 'Practice 2',
    solution: [1, 1, 5, 5, 6, 6, 5],
  },
  {
    id: 3,
    title: 'Practice 3',
    solution: [3, 6, 5, 6, 5, 2],
  },
] as Practice[];

const practiceOverviews = practices.map(
  (lesson) => ({ id: lesson.id, title: lesson.title } as PracticeOverview)
);

@Injectable({
  providedIn: 'root',
})
export class PracticeService {
  public getPracticeOverviews(): Observable<PracticeOverview[]> {
    return of(practiceOverviews);
  }

  public getPractice(id: number): Observable<Practice> {
    return of(practices.find((lesson) => lesson.id === id)!);
  }
}
