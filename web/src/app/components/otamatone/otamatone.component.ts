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
import type { Position } from './buttons';
import { buttons } from './buttons';
import type { Labels } from './configuration';
import { allPositions } from './configuration';

const STICK_WIDTH = 400;
const STICK_HEIGHT = 20;
const STICK_STROKE_WIDTH = 1;
const BUTTON_SIZE = 20;
const CIRCLE_SIZE = 250;
const EYE_SIZE = 20;

/**
 * Create the head of otamatone
 */
function createHead(primary: string, secondary: string): Group {
  const root = new Group();

  const face = new Circle({
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    stroke: primary,
    fill: primary,
    x: -(CIRCLE_SIZE / 2),
    y: STICK_HEIGHT / 2,
  });

  const eye1 = new Circle({
    width: EYE_SIZE,
    height: EYE_SIZE,
    fill: 'black',
    x: -(CIRCLE_SIZE / 3),
    y: -30,
  });

  const eye2 = new Circle({
    width: EYE_SIZE,
    height: EYE_SIZE,
    fill: 'black',
    x: -(CIRCLE_SIZE / 3),
    y: 30 + STICK_HEIGHT / 2,
  });

  const mouth = new Line({
    points: [
      // point 1
      0,
      CIRCLE_SIZE / 3,
      // point 2
      -20,
      0,
      // point 3
      0,
      -CIRCLE_SIZE / 3,
    ],
    tension: 0.3,
    stroke: 'black',
    strokeWidth: 3,
    x: -(CIRCLE_SIZE / 1.7),
    y: STICK_HEIGHT / 2,
  });

  root.add(face);
  root.add(eye1);
  root.add(eye2);
  root.add(mouth);

  return root;
}

function createTail(primary: string): Line {
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
    strokeWidth: STICK_HEIGHT + STICK_STROKE_WIDTH * 2,
    y: STICK_HEIGHT / 2,
    x: STICK_WIDTH,
  });

  return tail;
}

/**
 * Create the stick of otamaone and all the buttons on it
 * @param labels
 * @param onPlay
 * @param positions
 * @returns
 */
function createStick(
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
    width: STICK_WIDTH,
    height: STICK_HEIGHT,
    fill: primary,
    stroke: primary,
    strokeWidth: 2,
  });

  const defaultCursor = stage.container().style.cursor;

  stick.add(stickRect);
  stick.add(
    ...buttons(
      STICK_WIDTH,
      STICK_HEIGHT,
      BUTTON_SIZE,
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

@Component({
  selector: 'app-otamatone',
  templateUrl: './otamatone.component.html',
})
export class OtamatoneComponent implements AfterViewInit {
  @Input()
  positions: readonly Position[] = allPositions;

  @Input()
  labels: Labels = (position: Position) => `${position}`;

  @Output()
  onPlay: EventEmitter<Position> = new EventEmitter();

  @ViewChild('content')
  content!: ElementRef;

  private observer!: ResizeObserver;

  private stage!: Stage;
  private layer!: Layer;
  private otamatone!: Group;
  private stick!: Group;

  constructor() {}

  ngAfterViewInit(): void {
    this.stage = new Stage({
      container: this.content.nativeElement,
      height: CIRCLE_SIZE + 50,
      width: this.content.nativeElement.clientWidth,
    });

    this.layer = new Layer({});
    this.stage.add(this.layer);

    const primary = 'lightblue';
    const secondary = 'orange';

    this.stick = createStick(
      this.stage,
      this.labels,
      this.onPlay,
      this.positions,
      primary,
      secondary
    );

    const head = createHead(primary, secondary);
    const tail = createTail(primary);

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
}
