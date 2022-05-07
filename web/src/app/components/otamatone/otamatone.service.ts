import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import audioFiles from './audios';
import { Position } from './configuration';

@Injectable({ providedIn: 'root' })
export class OtamatoneService {
  private audios: { [position in Position]: HTMLAudioElement } = {};
  private scheduled: Position[] = [];

  public isPlaying: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  /**
   * Fetch the audio for position if the audio has not already been fetched
   * @param position
   * @returns
   */
  public fetch(position: Position): Promise<void> {
    if (this.audios.hasOwnProperty(position)) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      this.audios[position] = new Audio(audioFiles[position]);
      resolve();
    });
  }

  /**
   * Queue a list of positions to play
   * @param positions
   */
  public play(positions: Position[]): void;

  /**
   * Queue a position to play
   * @param position
   */
  public play(position: Position): void;

  public play(arg0: Position | Position[]): void {
    if (Array.isArray(arg0)) {
      this.scheduled.push(...arg0);
    } else {
      this.scheduled.push(arg0);
    }

    if (!this.isPlaying.value) {
      this.#startPlaying();
    }
  }

  /**
   * Asynchronously play an audio
   * @param audio the audio to play
   * @returns a promise that resolves after the audio has ended
   */
  #playAudio(audio: HTMLAudioElement): Promise<void> {
    return new Promise((resolve) => {
      const onEnded = () => {
        resolve();
        audio.removeEventListener('ended', onEnded);
      };

      audio.addEventListener('ended', onEnded);
      audio.play();
    });
  }

  /**
   * Empty the playing queue
   */
  async #startPlaying(): Promise<void> {
    this.isPlaying.next(true);

    while (this.scheduled.length > 0) {
      const first = this.scheduled.shift()!;
      await this.fetch(first);
      await this.#playAudio(this.audios[first]);
    }

    this.isPlaying.next(false);
  }
}
