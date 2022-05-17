import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Otamatone } from './otamatone.component';
import { Note } from './note.component';
import { Transform } from './transform.directive';

@NgModule({
  declarations: [Otamatone, Note, Transform],
  exports: [Otamatone],
  imports: [CommonModule],
})
export class OtamatoneModule {}
