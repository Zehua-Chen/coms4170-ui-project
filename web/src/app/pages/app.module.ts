import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';

import { OtamatoneModule } from 'components/otamatone';
import { OtamatoneClipModule } from 'components/otamatone-clip';
import { TwoColumnModule } from 'components/two-column';

import { LearnPage } from './learn/learn.component';
import { QuizPage } from './quiz/quiz.component';
import { ArraysEqualModule } from 'utils/arrays-equal';

const routes = [
  {
    path: '',
    redirectTo: 'learn/0',
  },
  { path: 'learn', redirectTo: 'learn/0', pathMatch: 'full' },
  {
    path: 'learn/:index',
    component: LearnPage,
  },
  { path: 'quiz', redirectTo: 'quiz/1', pathMatch: 'full' },
  { path: 'quiz/:id', component: QuizPage },
] as Routes;

@NgModule({
  declarations: [LearnPage, QuizPage],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    OtamatoneModule,
    OtamatoneClipModule,
    TwoColumnModule,
    ArraysEqualModule,
  ],
  exports: [RouterModule],
})
export class AppModule {}
