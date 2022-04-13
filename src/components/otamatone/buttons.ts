import Konva from "konva";
import type { Labels } from "./configuration";

export type Position = number;

export const allPositions: Position[] = [1, 2, 3, 4, 5, 6, 7].reverse();

function xs(stickWidth: number, buttonSize: number) {
  const spaceCount = allPositions.length - 1;
  const buttonSpace = allPositions.length * buttonSize;
  const spaceWidth = (stickWidth - buttonSpace) / spaceCount;

  return allPositions.map((position, index) => ({
    position,
    x: index * (spaceWidth + buttonSize) + buttonSize / 2,
  }));
}

function buttonShapes(
  stickWidth: number,
  stickHeight: number,
  buttonSize: number,
  labels: Labels
): Konva.Group[] {
  return xs(stickWidth, buttonSize).map(({ position, x }) => {
    const button = new Konva.Group();

    const circle = new Konva.Circle({
      x,
      y: stickHeight / 2,
      width: buttonSize,
      height: buttonSize,
      fill: "blue",
    });
    circle.setAttr("otamatonePosition", position);
    button.add(circle);

    const text = new Konva.Text({
      text: labels(position),
      x,
      y: -20,
      align: "center",
    });

    text.offsetX(text.getWidth() / 2);

    button.add(text);

    return button;
  });
}

export function buttons(
  stickWidth: number,
  stickHeight: number,
  buttonSize: number,
  labels: Labels,
  audios: string[]
): Konva.Group[] {
  return buttonShapes(stickWidth, stickHeight, buttonSize, labels).map(
    (circle, index) => {
      circle.on("click", () => {
        console.log(`play ${audios[index]}`);
      });

      return circle;
    }
  );
}
