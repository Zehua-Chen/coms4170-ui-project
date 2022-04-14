export type Position = number;
export type Labels = (position: number) => string;

export interface OtamatoneConfiguration {
  /**
   * The enabled positions
   */
  positions: readonly Position[];

  /**
   * How to display labels of enabled positions
   */
  labels: Labels;

  /**
   * Called when a position is played
   */
  onPlay: (position: Position) => any;
}

export const allPositions: readonly Position[] = [
  1, 2, 3, 4, 5, 6, 7,
].reverse();

export function applyDefault(
  configuration: Partial<OtamatoneConfiguration>
): OtamatoneConfiguration {
  const {
    positions = allPositions,
    labels = (position) => `${position}`,
    onPlay = () => {},
  } = configuration;

  return {
    positions,
    labels,
    onPlay,
  };
}
