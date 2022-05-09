import { Observable, map } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LessonService, Lesson } from 'app/api';
import { OtamatoneService } from 'components/otamatone';

@Component({
  selector: 'app-page-learn',
  templateUrl: './learn.component.html',
  styleUrls: ['./learn.component.scss'],
})
export class LearnPage implements OnInit {
  position: number = -1;

  lesson!: Observable<Lesson>;
  note: number = 1;

  get nextLessonLink(): Observable<string> {
    return this.lesson.pipe(map((lesson) => `/app/learn/${lesson.id + 1}`));
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

      this.lesson = this.lessonService.getLesson(id);

      this.lesson.subscribe((lesson) => {
        this.note = lesson.note;
      });
    });
  }

  onPlay(position: number): void {
    this.position = position;
  }

  playClip(): void {
    this.otamatoneService.play(this.note);
  }
}
