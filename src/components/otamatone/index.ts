import Konva from "konva";
import { createComponentFromClass, ClassComponent } from "../component";
import type { Position } from "./buttons";
import { buttons } from "./buttons";
import type { OtamatoneConfiguration } from "./configuration";
import { applyDefault } from "./configuration";
import audios from "./audios";

export { Position, OtamatoneConfiguration };

const STICK_WIDTH = 400;
const STICK_HEIGHT = 20;
const BUTTON_SIZE = 20;

export class OtamatoneComponent extends ClassComponent<
  Partial<OtamatoneConfiguration>,
  HTMLDivElement
> {
  private counter: number = 0;
  private observer: ResizeObserver;
  private stage: Konva.Stage;
  private layer: Konva.Layer;
  private otamatone: Konva.Group;

  constructor(
    root: JQuery<HTMLDivElement>,
    config: Partial<OtamatoneConfiguration>
  ) {
    super(root, config);

    const solidConfig = applyDefault(config);

    root.empty();

    const rootElement = root.get()[0];

    this.observer = new ResizeObserver(this.onResize.bind(this));
    this.observer.observe(rootElement);

    this.stage = new Konva.Stage({
      container: rootElement,
      height: 200,
      width: rootElement.clientWidth,
    });

    this.layer = new Konva.Layer({});
    this.stage.add(this.layer);

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
      ...buttons(
        STICK_WIDTH,
        STICK_HEIGHT,
        BUTTON_SIZE,
        solidConfig.labels,
        audios
      )
    );

    // console.log(...stickPositions());

    this.otamatone = new Konva.Group();
    this.otamatone.add(stick);

    this.otamatone.x(20);
    this.otamatone.y(20);

    // add the shape to the layer
    this.layer.add(this.otamatone);
  }

  public override update(
    root: JQuery<HTMLElement>,
    config: Partial<OtamatoneConfiguration>
  ): void {
    this.counter += 1;

    console.log(`update ${this.counter}`);
  }

  private onResize(entries: ResizeObserverEntry[]) {
    const entry = entries[0];

    this.stage.width(entry.contentRect.width);
  }
}

export default createComponentFromClass(OtamatoneComponent);
