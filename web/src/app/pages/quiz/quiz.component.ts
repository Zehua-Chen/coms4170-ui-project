import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {
  combineLatest,
  map,
  first,
  shareReplay,
  distinctUntilChanged,
  filter,
  concatMap,
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
import { arraysEqual } from 'src/app/utils';

/**
 * Questions by default do not have index associated with them
 */
export interface QuestionAndIndex {
  question: Question;
  index: number;
}

export type NavItemState = 'right' | 'wrong' | 'todo';

export interface NavItem {
  title: string;
  link: string;

  state: NavItemState;
  active: boolean;
}

function state(submission: number[], solution: number[]): NavItemState {
  if (submission.length === 0) {
    return 'todo';
  }

  return arraysEqual(submission, solution) ? 'right' : 'wrong';
}

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
})
export class QuizPage implements OnInit, OnDestroy {
  quizId$: Observable<string> = this.route.paramMap.pipe(
    map((params) => params.get('id')!),
    filter((id) => id !== null),
    distinctUntilChanged(),
    shareReplay(1)
  );

  questionIndex$: Observable<number> = this.route.paramMap.pipe(
    map((params) => params.get('question')!),
    filter((question) => Boolean(question)),
    map((question) => Number.parseInt(question)),
    distinctUntilChanged(),
    shareReplay(1)
  );

  quiz$: Observable<Quiz | undefined> = this.quizId$.pipe(
    concatMap((id) => this.quizService.getQuiz(id!)),
    shareReplay(1)
  );

  quizTotalScore$: Observable<number> = this.quiz$.pipe(
    quizTotalScore(),
    shareReplay(1)
  );
  quizScore$: Observable<number> = this.quiz$.pipe(quizScore(), shareReplay(1));

  questions$: Observable<QuestionAndIndex[]> = this.quiz$.pipe(
    filter((quiz) => quiz !== undefined),
    map((quiz) =>
      quiz!.questions.map((question, index) => ({ question, index }))
    ),
    shareReplay(1)
  );

  navItems$: Observable<NavItem[]> = combineLatest([
    this.quiz$,
    this.questions$,
    this.questionIndex$,
  ]).pipe(
    map(([quiz, questions, questionIndex]) => {
      return questions.map(
        ({ question, index }) =>
          ({
            title: question.title,
            state: state(question.submission, question.solution),
            link: `/app/quiz/${quiz?.id}/${index}`,
            active: questionIndex === index,
          } as NavItem)
      );
    }),
    shareReplay(1)
  );

  question$: Observable<QuestionAndIndex> = combineLatest([
    this.questions$,
    this.questionIndex$,
  ]).pipe(
    map(([questions, index]) => questions[index]),
    shareReplay(1)
  );

  hasSubmission$: Observable<boolean> = this.question$.pipe(
    map(({ question }) => question.submission.length > 0),
    shareReplay(1)
  );

  previousDisabled$: Observable<boolean>;

  nextDisabled$: Observable<boolean>;

  previousLink$: Observable<string> = combineLatest([
    this.quizId$,
    this.questionIndex$,
  ]).pipe(
    map(
      ([quizId, questionIndex]) => `/app/quiz/${quizId}/${questionIndex - 1}`
    ),
    shareReplay(1)
  );

  nextLink$: Observable<string> = combineLatest([
    this.quizId$,
    this.questionIndex$,
  ]).pipe(
    map(
      ([quizId, questionIndex]) => `/app/quiz/${quizId}/${questionIndex + 1}`
    ),
    shareReplay(1)
  );

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
        first(),
        filter(([_, quiz]) => Boolean(quiz)),
        map(([{ question, index }, quiz]) => {
          const newQuiz = Object.assign({}, quiz) as Quiz;
          const newQuestion = { ...question };
          newQuestion.submission = this.notes;

          newQuiz.questions = [...quiz!.questions];
          newQuiz.questions[index] = newQuestion;

          return newQuiz;
        }),
        concatMap(({ id, ...content }) => this.quizService.setQuiz(id, content))
      )
      .subscribe({
        error(e) {
          alert(e);
        },
      });
  }
}
