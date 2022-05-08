import {
  Component,
  ElementRef,
  AfterViewInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

import type { Labels, Position } from './configuration';
import { allPositions } from './configuration';
import { OtamatoneService } from './otamatone.service';

@Component({
  selector: 'app-otamatone',
  templateUrl: './otamatone.component.html',
  styleUrls: ['./otamatone.component.scss'],
})
export class Otamatone implements AfterViewInit {
  @Input()
  positions: readonly Position[] = allPositions;

  @Output()
  onPlay: EventEmitter<Position> = new EventEmitter();

  @Input()
  labels: Labels = (position: Position) => `${position}`;

  public get stickWidth(): number {
    return 400;
  }

  public get stickHeight(): number {
    return 20;
  }

  public get stickStrokeWidth(): number {
    return 1;
  }

  public get buttonSize(): number {
    return 20;
  }

  public get faceSize(): number {
    return 250;
  }

  public get eyeSize(): number {
    return 20;
  }

  public get tailSeparatorSize(): number {
    return 10;
  }

  public get tailSize(): number {
    return 50;
  }

  public get allPositions(): readonly Position[] {
    return allPositions;
  }

  public get mousePoints(): string {
    return `
      ${this.faceSize / 2.5},${this.faceSize / 3}
      ${this.faceSize / 3},${this.faceSize / 2}
      ${this.faceSize / 2.5},${this.faceSize / 1.5}`;
  }

  constructor(private otamatoneService: OtamatoneService) {}

  ngAfterViewInit(): void {}

  public get spaceCount(): number {
    return this.allPositions.length - 1;
  }

  public get buttonSpace(): number {
    return this.allPositions.length * this.buttonSize;
  }

  public get spaceWidth(): number {
    return (this.stickWidth - this.buttonSpace) / this.spaceCount;
  }

  public isDisabled(position: Position): boolean {
    return this.positions.find((p) => p === position) === undefined;
  }
}
