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

/**
 * Given an audio imported using `import a from "path"` syntax. Create an
 * `HTMLAudioElement`
 * @param audio the audio file
 * @returns
 */
function getAudio(audio: string): HTMLAudioElement {
  // Vite import returns a relative url. For development, where assets are
  // served from a different address from the flask server, this would cause
  // issues if it is not modified
  const audioFile =
    import.meta.env.MODE === "development"
      ? `http://localhost:3000${audio}`
      : audio;

  return new Audio(audioFile);
}

export function buttons(
  stickWidth: number,
  stickHeight: number,
  buttonSize: number,
  labels: Labels,
  onPlay: OnPlay
): Konva.Group[] {
  return xs(stickWidth, buttonSize).map(({ position, x }, index) => {
    const button = new Konva.Group();
    button.setAttr("stickPosition", position);

    const circle = new Konva.Circle({
      x,
      y: stickHeight / 2,
      width: buttonSize,
      height: buttonSize,
      fill: "blue",
    });

    const audio = getAudio(audios[position]);

    circle.on("click", async () => {
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
      });

      text.offsetX(text.getWidth() / 2);

      button.add(text);
    }

    return button;
  });
}
