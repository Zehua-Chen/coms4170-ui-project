import { Observable, map, zip } from 'rxjs';
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

  get previousLessonLink(): Observable<string> {
    return this.lesson.pipe(map((lesson) => `/app/learn/${lesson.id - 1}`));
  }

  get nextLessonLink(): Observable<string> {
    return zip(this.lesson, this.lessonOverviews).pipe(
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
    });
  }

  onPlay(position: number): void {
    this.playedPosition = position;
  }
}
