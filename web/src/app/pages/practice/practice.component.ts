import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-page-practice',
  templateUrl: './practice.component.html',
  styleUrls: ['./practice.component.scss'],
})
export class PracticePage implements OnInit {
  positions: number[] = [];
  id: number = 0;

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
