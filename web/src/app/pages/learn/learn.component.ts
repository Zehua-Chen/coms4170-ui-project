import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LessonService } from 'app/api';

export interface Lesson {
  id: number;
  title: string;
}

@Component({
  selector: 'app-page-learn',
  templateUrl: './learn.component.html',
  styleUrls: ['./learn.component.scss'],
})
export class LearnPage implements OnInit {
  position: number = -1;
  id: number = -1;

  constructor(
    public lessonService: LessonService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id') ?? '1';
      this.id = Number.parseInt(id);
    });
  }

  onPlay(position: number): void {
    this.position = position;
  }

  playClip(): void {}
}
