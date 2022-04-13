import Konva from "konva";

export type Position = number;

const BUTTON_WIDTH = 3;

export const allPositions: Position[] = [1, 2, 3, 4, 5, 6, 7].reverse();

function xs(stickWidth: number) {
  const spaceCount = allPositions.length - 1;
  const spaceWidth = stickWidth / spaceCount;

  return allPositions.map((position, index) => ({
    position,
    x: index * spaceWidth,
  }));
}

function buttonCircles(stickWidth: number, stickHeight: number): Konva.Shape[] {
  return xs(stickWidth).map(({ position, x }) => {
    const button = new Konva.Circle({
      x,
      y: stickHeight / 2,
      width: BUTTON_WIDTH,
      height: stickHeight,
      fill: "blue",
    });

    return button;
  });
}

export function buttons(
  stickWidth: number,
  stickHeight: number,
  audios: string[]
): Konva.Shape[] {
  return buttonCircles(stickWidth, stickHeight).map((circle, index) => {
    circle.on("click", () => {
      console.log(`play ${audios[index]}`);
    });

    return circle;
  });
}
