import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-practice',
  templateUrl: './practice.component.html',
  styleUrls: ['./practice.component.scss'],
})
export class PracticePage implements OnInit {
  positions: number[] = [];

  constructor() {}

  ngOnInit(): void {}

  onPlay(position: number): void {
    this.positions.push(position);
    console.log(this.positions);
  }
}
