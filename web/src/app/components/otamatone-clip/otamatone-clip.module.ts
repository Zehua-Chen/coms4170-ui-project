import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { OtamatoneClip } from './otamatone-clip.component';

@NgModule({
  declarations: [OtamatoneClip],
  imports: [CommonModule, MatButtonModule],
  exports: [OtamatoneClip],
  providers: [],
})
export class OtamatoneClipModule {}
