import { Observable, map, combineLatest } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LessonService, Lesson } from 'api/lessons.service';
import { OtamatoneService } from 'components/otamatone';

@Component({
  selector: 'app-page-learn',
  templateUrl: './learn.component.html',
})
export class LearnPage implements OnInit {
  playedPositions: number[] = [];

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
    this.lessons$ = this.lessonService.lessons$;
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
    ]).pipe(
      map(([lesson, lessons]) => {
        if (!lesson || lesson.index >= lessons.length) {
          return [null, false];
        }

        if (lesson.id === lessons[0].id) {
          return [lesson, true];
        }

        return [lesson, false];
      })
    );

    const isLastLesson: Observable<[Lesson | null, boolean]> = combineLatest([
      this.lesson$,
      this.lessons$,
    ]).pipe(
      map(([lesson, overviews]) => {
        if (!lesson || lesson.index >= overviews.length) {
          return [null, false];
        }

        if (lesson.id === overviews[overviews.length - 1].id) {
          return [lesson, true];
        }

        return [lesson, false];
      })
    );

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
  }

  onPlay(position: number): void {
    this.playedPositions.push(position);
  }
}
