import { Component } from '@angular/core';

@Component({
  selector: 'app-page-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent {
  positions: number[] = [1, 2, 3];

  constructor() {}

  onPlay(position: number): void {
    this.positions.push(position);
  }
}
