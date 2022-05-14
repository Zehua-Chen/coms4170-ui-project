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

import { Quiz, Question, QuizService } from 'api/quiz.service';
import { OtamatoneClip } from 'components/otamatone-clip';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
})
export class QuizPage implements OnInit, OnDestroy {
  quiz$!: Observable<Quiz | undefined>;
  quizId$!: Observable<string>;

  questions$!: Observable<Question[]>;

  questionIndex$!: Observable<number>;
  question$!: Observable<Question | undefined>;

  /**
   * Notes to be played must be set in TypeScript, otherwise notes will be
   * visible in HTML
   */
  @ViewChild(OtamatoneClip)
  clip!: OtamatoneClip;

  clipNoteSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService
  ) {}

  ngOnInit(): void {
    this.quizId$ = this.route.paramMap.pipe(
      map((params) => params.get('id')!),
      filter((id) => id !== null)
    );

    this.questionIndex$ = this.route.paramMap.pipe(
      map((params) => params.get('question')!),
      filter((question) => question !== null),
      map((question) => Number.parseInt(question))
    );

    this.quiz$ = this.quizId$.pipe(
      mergeMap((id) => this.quizService.getQuiz(id!))
    );

    this.questions$ = this.quiz$.pipe(
      filter((quiz) => quiz !== undefined),
      map((quiz) => quiz!.questions)
    );

    this.question$ = combineLatest([this.questions$, this.questionIndex$]).pipe(
      map(([questions, index]) => questions[index])
    );

    this.clipNoteSubscription = this.question$.subscribe((question) => {
      this.clip.notes = question?.solution ?? [];
    });
  }

  ngOnDestroy(): void {
    this.clipNoteSubscription.unsubscribe();
  }
}
