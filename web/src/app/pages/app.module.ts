import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';

import { OtamatoneModule } from 'components/otamatone';
import { OtamatoneClipModule } from 'components/otamatone-clip';
import { TwoColumnModule } from 'components/two-column';

import { LearnPage } from './learn/learn.component';
import { QuizPage } from './quiz/quiz.component';
import { ArraysEqualModule } from 'utils/arrays-equal';
import { DashboardPage } from './dashboard/dashboard.component';

const routes = [
  {
    path: '',
    component: DashboardPage,
  },
  { path: 'learn', redirectTo: 'learn/0', pathMatch: 'full' },
  {
    path: 'learn/:index',
    component: LearnPage,
  },
  { path: 'quiz', redirectTo: '', pathMatch: 'full' },
  { path: 'quiz/:id', component: QuizPage },
] as Routes;

@NgModule({
  declarations: [LearnPage, QuizPage, DashboardPage],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatExpansionModule,
    OtamatoneModule,
    OtamatoneClipModule,
    TwoColumnModule,
    ArraysEqualModule,
  ],
  exports: [RouterModule],
})
export class AppModule {}
