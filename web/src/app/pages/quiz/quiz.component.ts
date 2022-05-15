import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {
  combineLatest,
  map,
  filter,
  mergeMap,
  Observable,
  Subscription,
} from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';

import { Quiz, Question, QuizService } from 'api/quiz.service';
import { OtamatoneClip } from 'components/otamatone-clip';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
})
export class QuizPage implements OnInit, OnDestroy {
  quizId$: Observable<string> = this.route.paramMap.pipe(
    map((params) => params.get('id')!),
    filter((id) => id !== null)
  );

  quiz$: Observable<Quiz | undefined> = this.quizId$.pipe(
    mergeMap((id) => this.quizService.getQuiz(id!))
  );

  questions$: Observable<Question[]> = this.quiz$.pipe(
    filter((quiz) => quiz !== undefined),
    map((quiz) => quiz!.questions)
  );

  questionIndex$: Observable<number> = this.route.paramMap.pipe(
    map((params) => params.get('question')!),
    filter((question) => question !== null),
    map((question) => Number.parseInt(question))
  );

  question$: Observable<Question | undefined> = combineLatest([
    this.questions$,
    this.questionIndex$,
  ]).pipe(map(([questions, index]) => questions[index]));

  /**
   * Notes to be played must be set in TypeScript, otherwise notes will be
   * visible in HTML
   */
  @ViewChild(OtamatoneClip)
  clip!: OtamatoneClip;

  notes: number[] = [];

  clipNoteSubscription: Subscription = this.question$.subscribe((question) => {
    this.clip.notes = question?.solution ?? [];
  });

  notesSubscription: Subscription = this.question$.subscribe((question) => {
    this.notes = question?.submission ?? [];
  });

  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.clipNoteSubscription.unsubscribe();
    this.notesSubscription.unsubscribe();
  }
}
