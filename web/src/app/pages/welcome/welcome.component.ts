import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseAuthService } from 'api/firebase-auth.service';

@Component({
  selector: 'app-page-welcome',
  templateUrl: './welcome.component.html',
})
export class WelcomeComponent {
  positions: number[] = [1, 2, 3];

  constructor(public auth: FirebaseAuthService, private router: Router) {}

  onPlay(position: number): void {
    this.positions.push(position);
  }

  async login(): Promise<void> {
    await this.auth.signinWithGoogle();
    this.router.navigateByUrl('/app');
  }
}
