import {
  Observable,
  map,
  combineLatest,
  filter,
  distinctUntilChanged,
  shareReplay,
} from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LessonService, Lesson } from 'app/api';
import { OtamatoneService } from 'app/components/otamatone';
import { isFirst, isLast } from 'app/rxjs';

function lessonEquals(a: Lesson, b: Lesson): boolean {
  return a.id === b.id;
}

export class NavItem {
  constructor(
    public title: string,
    public url: string,
    public active: boolean
  ) {}
}

@Component({
  selector: 'app-page-learn',
  templateUrl: './learn.component.html',
})
export class LearnPage implements OnInit {
  notes: number[] = [];

  lessonIndex$: Observable<number> = this.route.paramMap.pipe(
    map((map) => map.get('index')),
    filter((index) => Boolean(index)),
    map((index) => Number.parseInt(index!)),
    distinctUntilChanged(),
    shareReplay(1)
  );

  lessons$: Observable<Lesson[]> = this.lessonService.getLessons();

  lesson$: Observable<Lesson | null> = combineLatest([
    this.lessonIndex$,
    this.lessons$,
  ]).pipe(
    map(([lessonIndex, lessons]) => {
      return lessons[lessonIndex];
    }),
    shareReplay(1)
  );

  navItems$: Observable<NavItem[]> = combineLatest([
    this.lessons$,
    this.lessonIndex$,
  ]).pipe(
    map(([lessons, lessonIndex]) =>
      lessons.map(
        (lesson) =>
          new NavItem(
            lesson.title,
            `/app/learn/${lesson.index}`,
            lessonIndex === lesson.index
          )
      )
    ),
    shareReplay(1)
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
