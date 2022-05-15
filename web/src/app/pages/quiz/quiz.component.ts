import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {
  combineLatest,
  map,
  shareReplay,
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

/**
 * Questions by default do not have index associated with them
 */
export interface QuestionAndIndex {
  question: Question;
  index: number;
}

export interface NavItem {
  title: string;
  link: string;

  done: boolean;
  active: boolean;
}

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
})
export class QuizPage implements OnInit, OnDestroy {
  quizId$: Observable<string> = this.route.paramMap.pipe(
    map((params) => params.get('id')!),
    filter((id) => id !== null),
    shareReplay()
  );

  quiz$: Observable<Quiz | undefined> = this.quizId$.pipe(
    mergeMap((id) => this.quizService.getQuiz(id!)),
    shareReplay()
  );

  quizTotalScore$: Observable<number> = this.quiz$.pipe(
    quizTotalScore(),
    shareReplay()
  );
  quizScore$: Observable<number> = this.quiz$.pipe(quizScore(), shareReplay());

  questions$: Observable<QuestionAndIndex[]> = this.quiz$.pipe(
    filter((quiz) => quiz !== undefined),
    map((quiz) =>
      quiz!.questions.map((question, index) => ({ question, index }))
    ),
    shareReplay()
  );

  questionIndex$: Observable<number> = this.route.paramMap.pipe(
    map((params) => params.get('question')!),
    filter((question) => Boolean(question)),
    map((question) => Number.parseInt(question)),
    shareReplay()
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
            done: question.submission.length !== 0,
            link: `/app/quiz/${quiz?.id}/${index}`,
            active: questionIndex === index,
          } as NavItem)
      );
    }),
    shareReplay()
  );

  question$: Observable<QuestionAndIndex> = combineLatest([
    this.questions$,
    this.questionIndex$,
  ]).pipe(
    map(([questions, index]) => questions[index]),
    shareReplay()
  );

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
