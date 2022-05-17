import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import { FirebaseAuthGuard } from 'api/firebase-auth.service';

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
    canActivateChild: [FirebaseAuthGuard],
  },
];

@NgModule({
  declarations: [RootComponent, WelcomeComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    RouterModule.forRoot(routes),
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatDividerModule,
    OtamatoneModule,
  ],
  providers: [],
  bootstrap: [RootComponent],
})
export class RootModule {}
