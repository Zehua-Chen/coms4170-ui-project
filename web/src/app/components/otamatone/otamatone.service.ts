import { Injectable } from '@angular/core';
import audioFiles from './audios';
import { Position } from './configuration';

@Injectable({ providedIn: 'root' })
export class OtamatoneService {
  constructor() {
    console.log(audioFiles);
  }

  public async fetch(position: Position): Promise<void> {}

  public async play(positions: Position[]): Promise<void>;
  public async play(position: Position): Promise<void>;

  public async play(position: Position | Position[]): Promise<void> {}
}
