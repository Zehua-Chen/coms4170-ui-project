import Konva from "konva";
import type { Labels, OnPlay } from "./configuration";
import { allPositions } from "./configuration";
import audios from "./audios";

export type Position = number;

function xs(stickWidth: number, buttonSize: number) {
  const spaceCount = allPositions.length - 1;
  const buttonSpace = allPositions.length * buttonSize;
  const spaceWidth = (stickWidth - buttonSpace) / spaceCount;

  return allPositions.map((position, index) => ({
    position,
    x: index * (spaceWidth + buttonSize) + buttonSize / 2,
  }));
}

export function buttons(
  stickWidth: number,
  stickHeight: number,
  buttonSize: number,
  labels: Labels,
  onPlay: OnPlay,
  color: string,
  positions: readonly number[]
): Konva.Group[] {
  return xs(stickWidth, buttonSize).map(({ position, x }, index) => {
    const button = new Konva.Group();
    const enable = positions.find((x) => x === position) !== undefined;

    const circle = new Konva.Circle({
      x,
      y: stickHeight / 2,
      width: buttonSize,
      height: buttonSize,
      fill: enable ? color : "lightgray",
    });

    let audio: HTMLAudioElement | null = null;

    circle.on("mouseenter", () => {
      if (!audio) {
        audio = new Audio(audios[position]);
      }
    });

    circle.on("click", async () => {
      if (!audio) {
        audio = new Audio(audios[position]);
      }

      await audio.play();
      onPlay(position);
    });

    button.add(circle);

    const label = labels(position);

    if (label) {
      const text = new Konva.Text({
        text: label,
        x,
        y: -20,
        align: "center",
        fill: enable ? "black" : "lightgray",
      });

      text.offsetX(text.getWidth() / 2);

      button.add(text);
    }

    return button;
  });
}
