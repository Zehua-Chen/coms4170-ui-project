import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Otamatone } from './otamatone.component';
import { Transform } from './transform.directive';

@NgModule({
  declarations: [Otamatone, Transform],
  exports: [Otamatone],
  imports: [CommonModule],
  schemas: [NO_ERRORS_SCHEMA],
})
export class OtamatoneModule {}
