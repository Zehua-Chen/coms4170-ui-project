import {
  Component,
  ElementRef,
  AfterViewInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

import { Group } from 'konva/lib/Group';
import { Layer } from 'konva/lib/Layer';
import { Stage } from 'konva/lib/Stage';
import { Circle } from 'konva/lib/shapes/Circle';
import { Line } from 'konva/lib/shapes/Line';
import { Rect } from 'konva/lib/shapes/Rect';
import { Text } from 'konva/lib/shapes/Text';
import type { Labels, Position } from './configuration';
import { allPositions } from './configuration';
import audios from './audios';
import { OtamatoneService } from './otamatone.service';

@Component({
  selector: 'app-otamatone',
  templateUrl: './otamatone.component.html',
  styleUrls: ['./otamatone.component.scss'],
})
export class OtamatoneComponent implements AfterViewInit {
  @Input()
  positions: readonly Position[] = allPositions;

  @Input()
  labels: Labels = (position: Position) => `${position}`;

  @Input()
  stickWidth: number = 400;

  @Input()
  stickHeight: number = 20;

  @Input()
  stickStrokeWIdth: number = 1;

  @Input()
  buttonSize: number = 20;

  @Input()
  circleSize: number = 250;

  @Input()
  eyeSize: number = 20;

  @Output()
  onPlay: EventEmitter<Position> = new EventEmitter();

  @ViewChild('content')
  content!: ElementRef;

  private observer!: ResizeObserver;

  private stage!: Stage;
  private layer!: Layer;
  private otamatone!: Group;
  private stick!: Group;

  constructor(private otamatoneService: OtamatoneService) {}

  ngAfterViewInit(): void {
    this.stage = new Stage({
      container: this.content.nativeElement,
      height: this.circleSize + 50,
      width: this.content.nativeElement.clientWidth,
    });

    this.layer = new Layer({});
    this.stage.add(this.layer);

    const style = getComputedStyle(document.documentElement);

    const primary = style.getPropertyValue('--app-primary');
    const secondary = style.getPropertyValue('--app-accent');

    this.stick = this.#createStick(
      this.stage,
      this.labels,
      this.onPlay,
      this.positions,
      primary,
      secondary
    );

    const head = this.#createHead(primary, secondary);
    const tail = this.#createTail(primary);

    this.otamatone = new Group();
    this.otamatone.add(this.stick);
    this.otamatone.add(head);
    this.otamatone.add(tail);

    this.layer.add(this.otamatone);

    this.observer = new ResizeObserver(this.#onResize.bind(this));
    this.observer.observe(this.content.nativeElement);
  }

  #onResize(entries: ResizeObserverEntry[]): void {
    const entry = entries[0];

    this.stage.width(entry.contentRect.width);

    this.#setOtamatonePosition(
      entry.contentRect.width / 2,
      entry.contentRect.height / 2
    );
  }

  /**
   * Set the position of otamaone while centering the otamatone in the
   * horizontal and vertical center
   * @param x
   * @param y
   */
  #setOtamatonePosition(x: number, y: number): void {
    this.otamatone.x(x);
    this.otamatone.y(y);
    this.otamatone.offsetX(this.stick.getClientRect().width / 2);
    this.otamatone.offsetY(this.stick.getClientRect().height / 2);
  }

  #createHead(primary: string, secondary: string): Group {
    const root = new Group();

    const face = new Circle({
      width: this.circleSize,
      height: this.circleSize,
      stroke: primary,
      fill: primary,
      x: -(this.circleSize / 2),
      y: this.stickHeight / 2,
    });

    const eye1 = new Circle({
      width: this.eyeSize,
      height: this.eyeSize,
      fill: 'black',
      x: -(this.circleSize / 3),
      y: -30,
    });

    const eye2 = new Circle({
      width: this.eyeSize,
      height: this.eyeSize,
      fill: 'black',
      x: -(this.circleSize / 3),
      y: 30 + this.stickHeight / 2,
    });

    const mouth = new Line({
      points: [
        // point 1
        0,
        this.circleSize / 3,
        // point 2
        -20,
        0,
        // point 3
        0,
        -this.circleSize / 3,
      ],
      tension: 0.3,
      stroke: 'black',
      strokeWidth: 3,
      x: -(this.circleSize / 1.7),
      y: this.stickHeight / 2,
    });

    root.add(face);
    root.add(eye1);
    root.add(eye2);
    root.add(mouth);

    return root;
  }

  #createTail(primary: string): Line {
    const tail = new Line({
      points: [
        // point 0
        0, 0,
        // point 1
        90, 0,
        // point 2
        100, 10,
        // point 3
        100, 20,
        // point 4
        90, 60,
        // point 5
        120, 70,
      ],
      tension: 0.3,
      stroke: primary,
      strokeWidth: this.stickHeight + this.stickStrokeWIdth * 2,
      y: this.stickHeight / 2,
      x: this.stickWidth,
    });

    return tail;
  }

  #createStick(
    stage: Stage,
    labels: Labels,
    onPlay: EventEmitter<number>,
    positions: readonly number[],
    primary: string,
    secondary: string
  ): Group {
    const stick = new Group();

    const stickRect = new Rect({
      x: 0,
      y: 0,
      width: this.stickWidth,
      height: this.stickHeight,
      fill: primary,
      stroke: primary,
      strokeWidth: 2,
    });

    const defaultCursor = stage.container().style.cursor;

    stick.add(stickRect);
    stick.add(
      ...this.#buttons(
        this.stickWidth,
        this.stickHeight,
        this.buttonSize,
        labels,
        onPlay,
        secondary,
        positions
      ).map((button) => {
        button.on('mouseenter', () => {
          stage.container().style.cursor = 'pointer';
        });

        button.on('mouseleave', () => {
          stage.container().style.cursor = defaultCursor;
        });

        return button;
      })
    );

    return stick;
  }

  #xs(stickWidth: number, buttonSize: number) {
    const spaceCount = allPositions.length - 1;
    const buttonSpace = allPositions.length * buttonSize;
    const spaceWidth = (stickWidth - buttonSpace) / spaceCount;

    return allPositions.map((position, index) => ({
      position,
      x: index * (spaceWidth + buttonSize) + buttonSize / 2,
    }));
  }

  #buttons(
    stickWidth: number,
    stickHeight: number,
    buttonSize: number,
    labels: Labels,
    onPlay: EventEmitter<number>,
    color: string,
    positions: readonly number[]
  ): Group[] {
    return this.#xs(stickWidth, buttonSize).map(({ position, x }, index) => {
      const button = new Group();
      const enable = positions.find((x) => x === position) !== undefined;

      const circle = new Circle({
        x,
        y: stickHeight / 2,
        width: buttonSize,
        height: buttonSize,
        fill: enable ? color : 'lightgray',
      });

      circle.on('mouseenter', () => {
        this.otamatoneService.fetch(position);
      });

      circle.on('click', async () => {
        await this.otamatoneService.play(position);
        onPlay.emit(position);
      });

      button.add(circle);

      const label = labels(position);

      if (label) {
        const text = new Text({
          text: label,
          x,
          y: -20,
          align: 'center',
          fill: enable ? 'black' : 'lightgray',
        });

        text.offsetX(text.getWidth() / 2);

        button.add(text);
      }

      return button;
    });
  }
}
