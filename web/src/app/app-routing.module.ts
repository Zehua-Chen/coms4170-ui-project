import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { OtamatoneModule } from 'components/otamatone';
import { WelcomeComponent } from './pages/welcome/welcome.component';

const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent,
  },
  {
    path: 'learn',
    async loadChildren() {
      const { LearnModule } = await import('./pages/learn/learn.module');
      return LearnModule;
    },
  },
];

@NgModule({
  declarations: [WelcomeComponent],
  imports: [RouterModule.forRoot(routes), OtamatoneModule, MatButtonModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
