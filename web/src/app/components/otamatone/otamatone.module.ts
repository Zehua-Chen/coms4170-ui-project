import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Otamatone } from './otamatone.component';
import { OtamatoneService } from './otamatone.service';

@NgModule({
  declarations: [Otamatone],
  exports: [Otamatone],
  imports: [CommonModule],
  providers: [OtamatoneService],
  schemas: [NO_ERRORS_SCHEMA],
})
export class OtamatoneModule {}
