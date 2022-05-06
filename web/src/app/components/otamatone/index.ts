import { NgModule } from '@angular/core';
import { OtamatoneComponent } from './otamatone.component';
import { OtamatoneService } from './otamatone.service';
import type { Position, Labels } from './configuration';

export { Position, Labels };

@NgModule({
  declarations: [OtamatoneComponent],
  exports: [OtamatoneComponent],
  imports: [],
  providers: [OtamatoneService],
})
export class OtamatoneModule {}
