import $ from "jquery";

type OtamatoneLabels = { [position in number]: string };
type OtamatoneAudios = { [position in number]: string };

export interface OtamatoneConfiguration {
  /**
   * Map a position in the otamatone a string label
   */
  labels: OtamatoneLabels;

  /**
   * Map a position in the otamatone to a audio file
   */
  audios: OtamatoneAudios;

  /**
   * Called when a position is played
   */
  onPlay: (position: number) => any;
}

export default function otamatone<TElement>(
  root: JQuery<TElement>,
  config: OtamatoneConfiguration
) {
  const element = $("foo");
}
