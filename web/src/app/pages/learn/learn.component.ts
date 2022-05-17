import { Observable, map, combineLatest } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LessonService, Lesson } from 'app/api';
import { OtamatoneService } from 'app/components/otamatone';
import { isFirst, isLast } from 'app/utils/rxjs';

function lessonEquals(a: Lesson, b: Lesson): boolean {
  return a.id === b.id;
}

@Component({
  selector: 'app-page-learn',
  templateUrl: './learn.component.html',
})
export class LearnPage implements OnInit {
  notes: number[] = [];

  lessons$: Observable<Lesson[]> = this.lessonService.getLessons();

  lesson$: Observable<Lesson | null> = combineLatest([
    this.route.paramMap,
    this.lessons$,
  ]).pipe(
    map(([params, lessons]) => {
      const index = Number.parseInt(params.get('index')!);

      if (index > lessons.length) {
        return null;
      }

      return lessons[index];
    })
  );

  previousDisabled: Observable<boolean>;
  previousLink: Observable<string>;

  nextText: Observable<string>;
  nextLink: Observable<string>;

  constructor(
    public lessonService: LessonService,
    public otamatoneService: OtamatoneService,
    private route: ActivatedRoute
  ) {
    const isFirstLesson: Observable<[Lesson | null, boolean]> = combineLatest([
      this.lesson$,
      this.lessons$,
    ]).pipe(isFirst(lessonEquals));

    const isLastLesson: Observable<[Lesson | null, boolean]> = combineLatest([
      this.lesson$,
      this.lessons$,
    ]).pipe(isLast(lessonEquals));

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

  ngOnInit(): void {}
}
