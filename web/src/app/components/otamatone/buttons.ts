import { EventEmitter } from '@angular/core';
import { Group } from 'konva/lib/Group';
import { Circle } from 'konva/lib/shapes/Circle';
import { Text } from 'konva/lib/shapes/Text';
import type { Labels } from './configuration';
import { allPositions } from './configuration';
import audios from './audios';

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
  onPlay: EventEmitter<number>,
  color: string,
  positions: readonly number[]
): Group[] {
  return xs(stickWidth, buttonSize).map(({ position, x }, index) => {
    const button = new Group();
    const enable = positions.find((x) => x === position) !== undefined;

    const circle = new Circle({
      x,
      y: stickHeight / 2,
      width: buttonSize,
      height: buttonSize,
      fill: enable ? color : 'lightgray',
    });

    let audio: HTMLAudioElement | null = null;

    circle.on('mouseenter', () => {
      if (!audio) {
        audio = new Audio(audios[position]);
      }
    });

    circle.on('click', async () => {
      if (!audio) {
        audio = new Audio(audios[position]);
      }

      await audio.play();
      onPlay.emit(position);
    });

    button.add(circle);

    const label = labels(position);

    if (label) {
      const text = new Text({
        text: label,
        x,
        y: -20,
        align: 'center',
        fill: enable ? 'black' : 'lightgray',
      });

      text.offsetX(text.getWidth() / 2);

      button.add(text);
    }

    return button;
  });
}
