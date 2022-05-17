import { Component, Input } from '@angular/core';
import { OtamatoneService } from 'app/components/otamatone';

@Component({
  selector: 'app-otamatone-clip',
  templateUrl: './otamatone-clip.component.html',
})
export class OtamatoneClip {
  @Input()
  notes: number[] = [];

  @Input()
  idlePlayLabel: string = 'Play';

  @Input()
  playingPlayLabel: string = 'Playing...';

  constructor(public otamatoneService: OtamatoneService) {}

  play(): void {
    this.otamatoneService.play(this.notes);
  }
}
