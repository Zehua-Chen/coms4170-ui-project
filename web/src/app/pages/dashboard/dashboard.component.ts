import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';

import { QuizService, Quiz } from 'api/quiz.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardPage implements OnInit {
  quizzes$!: Observable<Quiz[]>;

  constructor(private quizService: QuizService) {}

  ngOnInit(): void {
    this.quizzes$ = this.quizService.getQuizzes();
  }

  makeQuiz(): void {
    this.quizService
      .createDefaultQuiz()
      .subscribe({ error: (error) => alert(error) });
  }

  deleteQuiz(id: string): void {
    this.quizService.deleteQuiz(id).subscribe({
      error: (error) => alert(error),
      complete: () => console.log('finish'),
    });
  }
}
