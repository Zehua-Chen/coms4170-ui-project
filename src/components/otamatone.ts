import $ from "jquery";
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

class OtamatoneComponent extends ClassComponent<OtamatoneConfiguration> {
  private counter: number = 0;

  public attach(
    root: JQuery<HTMLElement>,
    config: OtamatoneConfiguration
  ): void {
    console.log("attach");
  }

  public override update(
    root: JQuery<HTMLElement>,
    config: OtamatoneConfiguration
  ): void {
    this.counter += 1;

    console.log(`update ${this.counter}`);
  }
}

export default createComponentFromClass(OtamatoneComponent);
