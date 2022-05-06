import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OtamatoneModule } from 'components/otamatone';
import { LearnComponent } from './learn.component';

const routes = [{ path: '', component: LearnComponent }] as Routes;

@NgModule({
  declarations: [LearnComponent],
  imports: [RouterModule.forChild(routes), CommonModule, OtamatoneModule],
  exports: [RouterModule],
})
export class LearnModule {}
