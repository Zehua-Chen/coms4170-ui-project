import { Injectable } from '@angular/core';
import audioFiles from './audios';
import { Position } from './configuration';

@Injectable({ providedIn: 'root' })
export class OtamatoneService {
  private audios: { [position in number]: HTMLAudioElement } = {};

  public fetch(position: Position): Promise<void> {
    return new Promise((resolve) => {
      this.audios[position] = new Audio(audioFiles[position]);
      resolve();
    });
  }

  public async play(positions: Position[]): Promise<void>;
  public async play(position: Position): Promise<void>;

  public async play(position: Position | Position[]): Promise<void> {}
}
