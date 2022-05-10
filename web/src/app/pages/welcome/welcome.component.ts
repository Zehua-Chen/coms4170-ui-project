import { Component } from '@angular/core';
import { FirebaseAuthService } from 'api/firebase-auth.service';

@Component({
  selector: 'app-page-welcome',
  templateUrl: './welcome.component.html',
})
export class WelcomeComponent {
  positions: number[] = [1, 2, 3];

  constructor(public firebaseAuth: FirebaseAuthService) {}

  onPlay(position: number): void {
    this.positions.push(position);
  }

  login(): void {
    this.firebaseAuth.signinWithGoogle();
  }
}
