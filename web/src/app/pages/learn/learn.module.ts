import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OtamatoneModule } from 'components/otamatone';
import { LearnComponent } from './learn.component';

const routes = [{ path: '', component: LearnComponent }] as Routes;

@NgModule({
  declarations: [LearnComponent],
  imports: [RouterModule.forChild(routes), OtamatoneModule],
  exports: [RouterModule],
})
export class LearnModule {}
