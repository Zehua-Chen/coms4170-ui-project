import { Observable, map, zip, of } from 'rxjs';
import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LessonService, Lesson, LessonOverview } from 'app/api';
import { OtamatoneService } from 'components/otamatone';

@Component({
  selector: 'app-page-learn',
  templateUrl: './learn.component.html',
  styleUrls: ['./learn.component.scss'],
})
export class LearnPage implements OnInit {
  @HostBinding('class')
  get className(): string {
    return 'h-full block';
  }

  playedPosition: number | null = null;

  lesson!: Observable<Lesson>;
  lessonOverviews!: Observable<LessonOverview[]>;
  finishedLessons!: Observable<[Lesson, LessonOverview[]]>;

  get previousDisabled(): Observable<boolean> {
    return this.finishedLessons.pipe(
      map(([lesson, lessonOverviews]) => {
        if (lesson.id === lessonOverviews[0].id) {
          return true;
        }

        return false;
      })
    );
  }

  get previousLink(): Observable<string> {
    return this.lesson.pipe(map((lesson) => `/app/learn/${lesson.id - 1}`));
  }

  get nextText(): Observable<string> {
    return this.finishedLessons.pipe(
      map(([lesson, lessonOverviews]) => {
        if (lesson.id === lessonOverviews[lessonOverviews.length - 1].id) {
          return 'Practice';
        }

        return `Next`;
      })
    );
  }

  get nextLink(): Observable<string> {
    return this.finishedLessons.pipe(
      map(([lesson, lessonOverviews]) => {
        if (lesson.id === lessonOverviews[lessonOverviews.length - 1].id) {
          return '/app/practice';
        }

        return `/app/learn/${lesson.id + 1}`;
      })
    );
  }

  constructor(
    public lessonService: LessonService,
    public otamatoneService: OtamatoneService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idS = params.get('id')!;
      const id = Number.parseInt(idS);

      this.lessonOverviews = this.lessonService.getLessonOverviews();
      this.lesson = this.lessonService.getLesson(id);
      this.finishedLessons = zip(this.lesson, this.lessonOverviews);
    });
  }

  onPlay(position: number): void {
    this.playedPosition = position;
  }
}
