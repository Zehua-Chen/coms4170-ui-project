import { Observable, Subject, map, combineLatest, scan, share } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LessonService, Lesson } from 'api/lessons.service';
import { OtamatoneService } from 'components/otamatone';
import { isFirst, isLast } from 'utils/rxjs';

@Component({
  selector: 'app-page-learn',
  templateUrl: './learn.component.html',
})
export class LearnPage implements OnInit {
  playedPosition$: Subject<number> = new Subject<number>();
  playedPositions$!: Observable<number[]>;

  lesson$!: Observable<Lesson | null>;
  lessons$!: Observable<Lesson[]>;

  previousDisabled!: Observable<boolean>;
  previousLink!: Observable<string>;

  nextText!: Observable<string>;
  nextLink!: Observable<string>;

  constructor(
    public lessonService: LessonService,
    public otamatoneService: OtamatoneService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.lessons$ = this.lessonService.getLessons();
    this.lesson$ = combineLatest([this.route.paramMap, this.lessons$]).pipe(
      map(([params, lessons]) => {
        const index = Number.parseInt(params.get('index')!);

        if (index > lessons.length) {
          return null;
        }

        return lessons[index];
      })
    );

    const isFirstLesson: Observable<[Lesson | null, boolean]> = combineLatest([
      this.lesson$,
      this.lessons$,
    ]).pipe(isFirst());

    const isLastLesson: Observable<[Lesson | null, boolean]> = combineLatest([
      this.lesson$,
      this.lessons$,
    ]).pipe(isLast());

    this.previousDisabled = isFirstLesson.pipe(
      map(([_, first]) => {
        return first;
      })
    );

    this.previousLink = isFirstLesson.pipe(
      map(([lesson, first]) =>
        !first ? `/app/learn/${lesson ? lesson.index - 1 : 0}` : '/app/learn'
      )
    );

    this.nextText = isLastLesson.pipe(
      map(([_, last]) => {
        return last ? 'Quiz' : 'Next';
      })
    );

    this.nextLink = isLastLesson.pipe(
      map(([lesson, last]) => {
        if (last) {
          return '/app/quiz';
        }

        return `/app/learn/${lesson ? lesson.index + 1 : 0}`;
      })
    );

    this.playedPositions$ = this.playedPosition$.pipe(
      scan((positions, position) => {
        return [...positions, position];
      }, [] as number[]),
      share()
    );
  }

  onPlay(position: number): void {
    this.playedPosition$.next(position);
  }
}
