import { NgModule } from '@angular/core';
import { Otamatone } from './otamatone.component';
import { OtamatoneService } from './otamatone.service';
import type { Position, Labels } from './configuration';

export { Position, Labels };

@NgModule({
  declarations: [Otamatone],
  exports: [Otamatone],
  imports: [],
  providers: [OtamatoneService],
})
export class OtamatoneModule {}
