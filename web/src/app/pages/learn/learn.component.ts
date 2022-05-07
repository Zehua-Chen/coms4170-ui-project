import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-page-learn',
  templateUrl: './learn.component.html',
  styleUrls: ['./learn.component.scss'],
})
export class LearnPage implements OnInit {
  positions: number[] = [];
  id: number = -1;
  lessons: readonly number[] = [1, 2, 3, 4, 5, 6, 7];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id') ?? '1';
      this.id = Number.parseInt(id);
    });
  }

  onPlay(position: number): void {
    this.positions.push(position);
    console.log(this.positions);
  }
}
