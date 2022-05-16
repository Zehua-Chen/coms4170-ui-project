import { Observable, map } from 'rxjs';
import { Component, OnInit } from '@angular/core';

import {
  FirebaseAuthService,
  UserState,
} from 'src/app/api/firebase-auth.service';
import { QuizService, Quiz } from 'src/app/api/quiz.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardPage implements OnInit {
  user$: Observable<UserState> = this.auth.user$;
  quizzes$: Observable<Quiz[]> = this.quizService.getQuizzes();

  constructor(
    private auth: FirebaseAuthService,
    private quizService: QuizService
  ) {}

  ngOnInit(): void {}

  makeQuiz(): void {
    this.quizService.createDefaultQuiz().subscribe({
      error(error) {
        alert(error);
      },
    });
  }

  deleteQuiz(id: string): void {
    this.quizService.deleteQuiz(id).subscribe({
      error: (error) => alert(error),
    });
  }
}
