import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {
  combineLatest,
  map,
  first,
  filter,
  mergeMap,
  Observable,
  Subscription,
} from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import {
  Quiz,
  Question,
  QuizService,
  quizTotalScore,
  quizScore,
} from 'api/quiz.service';
import { OtamatoneClip } from 'components/otamatone-clip';
import { isFirst, isLast } from 'utils/rxjs';

export type QuestionAndIndex = { question: Question; index: number };

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

  quizTotalScore$: Observable<number> = this.quiz$.pipe(quizTotalScore());
  quizScore$: Observable<number> = this.quiz$.pipe(quizScore());

  questions$: Observable<QuestionAndIndex[]> = this.quiz$.pipe(
    filter((quiz) => quiz !== undefined),
    map((quiz) =>
      quiz!.questions.map((question, index) => ({ question, index }))
    )
  );

  questionIndex$: Observable<number> = this.route.paramMap.pipe(
    map((params) => params.get('question')!),
    filter((question) => question !== null),
    map((question) => Number.parseInt(question))
  );

  question$: Observable<QuestionAndIndex> = combineLatest([
    this.questions$,
    this.questionIndex$,
  ]).pipe(map(([questions, index]) => questions[index]));

  previousDisabled$: Observable<boolean>;

  nextDisabled$: Observable<boolean>;

  /**
   * Notes to be played must be set in TypeScript, otherwise notes will be
   * visible in HTML
   */
  @ViewChild(OtamatoneClip)
  clip!: OtamatoneClip;

  notes: number[] = [];

  clipNoteSubscription: Subscription = this.question$.subscribe((question) => {
    this.clip.notes = question?.question?.solution ?? [];
  });

  notesSubscription: Subscription = this.question$.subscribe((question) => {
    this.notes = question?.question?.submission ?? [];
  });

  constructor(private route: ActivatedRoute, private quizService: QuizService) {
    const isFirstQuestion: Observable<[QuestionAndIndex | null, boolean]> =
      combineLatest([this.question$, this.questions$]).pipe(isFirst());

    const isLastQuestion: Observable<[QuestionAndIndex | null, boolean]> =
      combineLatest([this.question$, this.questions$]).pipe(isLast());

    this.previousDisabled$ = isFirstQuestion.pipe(
      map(([_, first]) => {
        return first;
      })
    );

    this.nextDisabled$ = isLastQuestion.pipe(
      map(([_, last]) => {
        return last;
      })
    );
  }

  ngOnInit(): void {
    // this.quiz$.subscribe(() => console.log('new quiz'));
  }

  ngOnDestroy(): void {
    this.clipNoteSubscription.unsubscribe();
    this.notesSubscription.unsubscribe();
  }

  submit(): void {
    combineLatest([this.question$, this.quiz$])
      .pipe(
        filter(([_, quiz]) => Boolean(quiz)),
        map(([{ question, index }, quiz]) => {
          const newQuiz = Object.assign({}, quiz) as Quiz;
          const newQuestion = { ...question };
          newQuestion.submission = this.notes;

          newQuiz.questions = [...quiz!.questions];
          newQuiz.questions[index] = newQuestion;

          return newQuiz;
        }),
        mergeMap(({ id, ...content }) => this.quizService.setQuiz(id, content))
      )
      .subscribe({
        error(e) {
          alert(e);
        },
      });
  }
}
