import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OtamatoneModule } from 'components/otamatone';
import { LearnPage } from './learn/learn.component';
import { PracticePage } from './practice/practice.component';
import { QuizPage } from './quiz/quiz.component';

const routes = [
  { path: 'learn', component: LearnPage },
  { path: 'practice', component: PracticePage },
  { path: 'quiz', component: QuizPage },
] as Routes;

@NgModule({
  declarations: [LearnPage, PracticePage, QuizPage],
  imports: [RouterModule.forChild(routes), CommonModule, OtamatoneModule],
  exports: [RouterModule],
})
export class AppModule {}
