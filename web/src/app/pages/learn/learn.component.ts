import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-learn',
  templateUrl: './learn.component.html',
  styleUrls: ['./learn.component.scss'],
})
export class LearnComponent implements OnInit {
  positions: number[] = [];

  constructor() {}

  ngOnInit(): void {}

  onPlay(position: number): void {
    this.positions.push(position);
    console.log(this.positions);
  }
}
