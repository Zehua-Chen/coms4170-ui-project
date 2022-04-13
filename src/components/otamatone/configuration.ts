export type Position = number;

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

export function applyDefault(
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
