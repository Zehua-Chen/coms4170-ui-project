import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { RootComponent } from './root.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { OtamatoneModule } from 'components/otamatone';

const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent,
  },
  {
    path: 'app',
    async loadChildren() {
      const { AppModule } = await import('./pages/app.module');
      return AppModule;
    },
  },
];

@NgModule({
  declarations: [RootComponent, WelcomeComponent],
  imports: [
    BrowserModule,
    RouterModule,
    RouterModule.forRoot(routes),
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    OtamatoneModule,
  ],
  providers: [],
  bootstrap: [RootComponent],
})
export class RootModule {}
