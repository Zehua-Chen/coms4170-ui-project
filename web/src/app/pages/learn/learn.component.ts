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

  lesson?: Lesson;

  constructor(
    public lessonService: LessonService,
    public otamatoneService: OtamatoneService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idS = params.get('id')!;
      const id = Number.parseInt(idS);

      this.lessonService.getLesson(id).subscribe((lesson) => {
        this.lesson = lesson;
      });
    });
  }

  onPlay(position: number): void {
    this.position = position;
  }

  playClip(): void {
    this.otamatoneService.play(this.lesson!.note);
  }
}
