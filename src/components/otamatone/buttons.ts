import Konva from "konva";

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

function buttonCircles(
  stickWidth: number,
  stickHeight: number,
  buttonSize: number
): Konva.Shape[] {
  return xs(stickWidth, buttonSize).map(({ position, x }) => {
    const button = new Konva.Circle({
      x,
      y: stickHeight / 2,
      width: buttonSize,
      height: buttonSize,
      fill: "blue",
    });

    return button;
  });
}

export function buttons(
  stickWidth: number,
  stickHeight: number,
  buttonSize: number,
  audios: string[]
): Konva.Shape[] {
  return buttonCircles(stickWidth, stickHeight, buttonSize).map(
    (circle, index) => {
      circle.on("click", () => {
        console.log(`play ${audios[index]}`);
      });

      return circle;
    }
  );
}
