import Konva from "konva";
import { createComponentFromClass, ClassComponent } from "../component";
import type { Position } from "./buttons";
import { buttons } from "./buttons";
import type { Labels, OnPlay, OtamatoneConfiguration } from "./configuration";
import { allPositions } from "./configuration";

export { Position, OtamatoneConfiguration };

const STICK_WIDTH = 400;
const STICK_HEIGHT = 20;
const STICK_STROKE_WIDTH = 1;
const BUTTON_SIZE = 20;
const CIRCLE_SIZE = 250;
const EYE_SIZE = 20;

/**
 * Create the head of otamatone
 */
function createHead(primary: string, secondary: string): Konva.Group {
  const root = new Konva.Group();

  const face = new Konva.Circle({
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    stroke: primary,
    fill: primary,
    x: -(CIRCLE_SIZE / 2),
    y: STICK_HEIGHT / 2,
  });

  const eye1 = new Konva.Circle({
    width: EYE_SIZE,
    height: EYE_SIZE,
    fill: secondary,
    x: -(CIRCLE_SIZE / 3),
    y: -30,
  });

  const eye2 = new Konva.Circle({
    width: EYE_SIZE,
    height: EYE_SIZE,
    fill: secondary,
    x: -(CIRCLE_SIZE / 3),
    y: 30 + STICK_HEIGHT / 2,
  });

  const mouth = new Konva.Line({
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
    stroke: secondary,
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

function createTail(primary: string): Konva.Line {
  const tail = new Konva.Line({
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
  labels: Labels,
  onPlay: OnPlay,
  positions: readonly number[],
  primary: string,
  secondary: string
): Konva.Group {
  const stick = new Konva.Group();

  const stickRect = new Konva.Rect({
    x: 0,
    y: 0,
    width: STICK_WIDTH,
    height: STICK_HEIGHT,
    fill: primary,
    stroke: primary,
    strokeWidth: 2,
  });

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
    )
  );
  return stick;
}

export class OtamatoneComponent extends ClassComponent<
  Partial<OtamatoneConfiguration>,
  HTMLDivElement
> {
  private observer: ResizeObserver;
  private stage: Konva.Stage;
  private layer: Konva.Layer;
  private otamatone: Konva.Group;
  private stick: Konva.Group;

  constructor(
    root: JQuery<HTMLDivElement>,
    config: Partial<OtamatoneConfiguration>
  ) {
    super(root, config);

    const {
      positions = allPositions,
      labels = (position) => `${position}`,
      onPlay = () => {},
    } = config;

    root.empty();

    const style = getComputedStyle(document.body);
    const primary = style.getPropertyValue("--bs-primary");
    const secondary = style.getPropertyValue("--bs-secondary");

    const rootElement = root.get()[0];

    this.observer = new ResizeObserver(this.#onResize.bind(this));
    this.observer.observe(rootElement);

    this.stage = new Konva.Stage({
      container: rootElement,
      height: CIRCLE_SIZE + 50,
      width: rootElement.clientWidth,
    });

    this.layer = new Konva.Layer({});
    this.stage.add(this.layer);

    this.stick = createStick(labels, onPlay, positions, primary, secondary);
    const head = createHead(primary, secondary);
    const tail = createTail(primary);

    this.otamatone = new Konva.Group();
    this.otamatone.add(this.stick);
    this.otamatone.add(head);
    this.otamatone.add(tail);

    // add the shape to the layer
    this.layer.add(this.otamatone);

    this.#setOtamatonePosition(
      rootElement.clientWidth / 2,
      rootElement.clientHeight / 2
    );
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

export default createComponentFromClass(OtamatoneComponent);
