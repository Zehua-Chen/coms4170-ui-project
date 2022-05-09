import { Component, Input } from '@angular/core';
import { OtamatoneService } from 'components/otamatone/otamatone.service';

@Component({
  selector: 'app-otamatone-clip',
  templateUrl: './otamatone-clip.component.html',
})
export class OtamatoneClip {
  @Input()
  notes: number[] = [];

  constructor(public otamatoneService: OtamatoneService) {}

  play(): void {
    this.otamatoneService.play(this.notes);
  }
}
