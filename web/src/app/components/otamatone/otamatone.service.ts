import { Observable, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import audioFiles from './audios';
import { Position } from './configuration';

interface ScheduleItem {
  position: Position;
  resolve?: () => any;
}

@Injectable({ providedIn: 'root' })
export class OtamatoneService {
  private audios: { [position in Position]: HTMLAudioElement } = {};
  private scheduled: ScheduleItem[] = [];

  public get isPlaying$(): Observable<boolean> {
    return this.#isPlaying;
  }

  #isPlaying: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

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
  public play(positions: Position[]): Promise<void>;

  /**
   * Queue a position to play
   * @param position
   */
  public play(position: Position): Promise<void>;

  public play(arg0: Position | Position[]): Promise<void> {
    if (Array.isArray(arg0)) {
      if (arg0.length == 0) {
        return Promise.resolve();
      }

      for (let i = 0; i < arg0.length - 1; i++) {
        this.scheduled.push({ position: arg0[i] });
      }

      return new Promise((resolve) => {
        this.scheduled.push({ position: arg0[arg0.length - 1], resolve });

        this.#tryStartPlaying();
      });
    } else {
      return new Promise((resolve) => {
        this.scheduled.push({ position: arg0, resolve });

        this.#tryStartPlaying();
      });
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

  #tryStartPlaying(): void {
    if (!this.#isPlaying.value) {
      this.#startPlaying();
    }
  }

  /**
   * Empty the playing queue
   */
  async #startPlaying(): Promise<void> {
    this.#isPlaying.next(true);

    while (this.scheduled.length > 0) {
      const first = this.scheduled.shift()!;
      await this.fetch(first.position);
      await this.#playAudio(this.audios[first.position]);

      if (first.resolve) {
        first.resolve();
      }
    }

    this.#isPlaying.next(false);
  }
}
