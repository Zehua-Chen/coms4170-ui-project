import { createComponentFromClass, ClassComponent } from "./component";
import Konva from "konva";

type Position = number;

export interface OtamatoneConfiguration {
  /**
   * The enabled positions
   */
  positions: Position[];

  /**
   * How to display labels of enabled positions
   */
  labels: "string" | "number";

  /**
   * Called when a position is played
   */
  onPlay: (position: Position) => any;
}

function applyDefaultConfiguration(
  configuration: Partial<OtamatoneConfiguration>
): OtamatoneConfiguration {
  const {
    positions = [],
    labels = "string",
    onPlay = () => {},
  } = configuration;

  return {
    positions,
    labels,
    onPlay,
  };
}

export class OtamatoneComponent extends ClassComponent<
  Partial<OtamatoneConfiguration>,
  HTMLDivElement
> {
  private counter: number = 0;
  private observer: ResizeObserver;
  private stage: Konva.Stage;

  constructor(
    root: JQuery<HTMLDivElement>,
    config: Partial<OtamatoneConfiguration>
  ) {
    super(root, config);

    const solidConfig = applyDefaultConfiguration(config);

    root.empty();

    const rootElement = root.get()[0];

    this.observer = new ResizeObserver(this.onResize.bind(this));
    this.observer.observe(rootElement);

    this.stage = new Konva.Stage({
      container: rootElement,
      height: 200,
      width: rootElement.clientWidth,
    });
    const layer = new Konva.Layer({});
    this.stage.add(layer);

    const rect1 = new Konva.Rect({
      x: 20,
      y: 20,
      width: 400,
      height: 20,
      fill: "white",
      stroke: "black",
      strokeWidth: 2,
    });
    // add the shape to the layer
    layer.add(rect1);
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
