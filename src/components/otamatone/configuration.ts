export type Position = number;
export type Labels = (position: number) => string;

export interface OtamatoneConfiguration {
  /**
   * The enabled positions
   */
  positions: Position[];

  /**
   * How to display labels of enabled positions
   */
  labels: Labels;

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
    labels = (position) => `${position}`,
    onPlay = () => {},
  } = configuration;

  return {
    positions,
    labels,
    onPlay,
  };
}
