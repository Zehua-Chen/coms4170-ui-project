import { Component } from '@angular/core';
import { FirebaseAuthService } from 'api/firebase-auth.service';

@Component({
  selector: 'app-page-welcome',
  templateUrl: './welcome.component.html',
})
export class WelcomeComponent {
  positions: number[] = [1, 2, 3];

  constructor(public auth: FirebaseAuthService) {}

  onPlay(position: number): void {
    this.positions.push(position);
  }

  login(): void {
    this.auth.signinWithGoogle();
  }
}
