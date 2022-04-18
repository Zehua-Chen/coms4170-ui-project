export type Position = number;
export type Labels = (position: number) => string;
export type OnPlay = (position: Position) => any;

export interface OtamatoneConfiguration {
  /**
   * The enabled positions
   */
  positions: readonly Position[];

  /**
   * How to display labels of enabled positions. If the returned label is
   * falsy, then nothing is rendered
   */
  labels: Labels;

  /**
   * Called when a position is played
   */
  onPlay: OnPlay;
}

export const allPositions: readonly Position[] = [
  1, 2, 3, 4, 5, 6, 7,
].reverse();
