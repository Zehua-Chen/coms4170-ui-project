import Konva from "konva";
import { createComponentFromClass, ClassComponent } from "../component";
import type { Position } from "./buttons";
import { buttons } from "./buttons";
import type { Labels, OnPlay, OtamatoneConfiguration } from "./configuration";
import { allPositions } from "./configuration";

export { Position, OtamatoneConfiguration };

const STICK_WIDTH = 400;
const STICK_HEIGHT = 20;
const BUTTON_SIZE = 20;

/**
 * Create the circle of otamatone
 */
function createCircle(): Konva.Group {
  const root = new Konva.Group();

  return root;
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
  positions: readonly number[]
): Konva.Group {
  const stick = new Konva.Group();

  const stickRect = new Konva.Rect({
    x: 0,
    y: 0,
    width: STICK_WIDTH,
    height: STICK_HEIGHT,
    fill: "white",
    stroke: "black",
    strokeWidth: 2,
  });

  stick.add(stickRect);
  stick.add(
    ...buttons(STICK_WIDTH, STICK_HEIGHT, BUTTON_SIZE, labels, onPlay).filter(
      (button) => positions.includes(button.getAttr("stickPosition"))
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

    const rootElement = root.get()[0];

    this.observer = new ResizeObserver(this.#onResize.bind(this));
    this.observer.observe(rootElement);

    this.stage = new Konva.Stage({
      container: rootElement,
      height: 200,
      width: rootElement.clientWidth,
    });

    this.layer = new Konva.Layer({});
    this.stage.add(this.layer);

    const stick = createStick(labels, onPlay, positions);
    const circle = createCircle();

    this.otamatone = new Konva.Group();
    this.otamatone.add(stick);
    this.otamatone.add(circle);

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
    this.otamatone.offsetX(this.otamatone.getClientRect().width / 2);
    this.otamatone.offsetY(this.otamatone.getClientRect().height / 2);
  }
}

export default createComponentFromClass(OtamatoneComponent);
