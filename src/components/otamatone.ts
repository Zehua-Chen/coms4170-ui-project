import { createComponentFromClass, ClassComponent } from "./component";

type OtamatoneLabels = { [position in number]: string };
type OtamatoneAudios = { [position in number]: string };

export interface OtamatoneConfiguration {
  /**
   * Map a position in the otamatone a string label
   */
  labels?: OtamatoneLabels;

  /**
   * Map a position in the otamatone to a audio file
   */
  audios?: OtamatoneAudios;

  /**
   * Called when a position is played
   */
  onPlay?: (position: number) => any;
}

export class OtamatoneComponent extends ClassComponent<OtamatoneConfiguration> {
  private counter: number = 0;

  constructor(root: JQuery, config: OtamatoneConfiguration) {
    super(root, config);

    root.empty();

    root.text("placeholder for otamatone...");
  }

  public override update(
    root: JQuery<HTMLElement>,
    config: OtamatoneConfiguration
  ): void {
    this.counter += 1;

    console.log(`update ${this.counter}`);
  }
}

export default createComponentFromClass<
  OtamatoneConfiguration,
  OtamatoneComponent
>(OtamatoneComponent);
