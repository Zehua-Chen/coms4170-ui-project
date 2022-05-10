import { Observable, map, zip, mergeMap } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LessonService, Lesson, LessonOverview } from 'api/lessons.service';
import { OtamatoneService } from 'components/otamatone';

@Component({
  selector: 'app-page-learn',
  templateUrl: './learn.component.html',
})
export class LearnPage implements OnInit {
  playedPosition: number | null = null;

  lesson!: Observable<Lesson>;
  lessonOverviews!: Observable<LessonOverview[]>;

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
    this.lessonOverviews = this.lessonService.getLessonOverviews();
    this.lesson = this.route.paramMap.pipe(
      mergeMap((params) => {
        const idS = params.get('id')!;
        const id = Number.parseInt(idS);

        return this.lessonService.getLesson(id);
      })
    );

    const isFirstLesson: Observable<[Lesson, boolean]> = zip(
      this.lesson,
      this.lessonOverviews
    ).pipe(
      map(([lesson, overviews]) => {
        if (lesson.id === overviews[0].id) {
          return [lesson, true];
        }

        return [lesson, false];
      })
    );

    const isLastLesson: Observable<[Lesson, boolean]> = zip(
      this.lesson,
      this.lessonOverviews
    ).pipe(
      map(([lesson, overviews]) => {
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
        !first ? `/app/learn/${lesson.id - 1}` : '/app/learn'
      )
    );

    this.nextText = isLastLesson.pipe(
      map(([_, last]) => {
        return last ? 'Practice' : 'Next';
      })
    );

    this.nextLink = isLastLesson.pipe(
      map(([lesson, last]) => {
        if (last) {
          return '/app/practice';
        }

        return `/app/learn/${lesson.id + 1}`;
      })
    );
  }

  onPlay(position: number): void {
    this.playedPosition = position;
  }
}
