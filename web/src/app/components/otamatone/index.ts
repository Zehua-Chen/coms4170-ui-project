import { NgModule } from '@angular/core';
import { OtamatoneComponent } from './otamatone.component';
import type { Position, Labels } from './configuration';

export { Position, Labels };

@NgModule({
  declarations: [OtamatoneComponent],
  exports: [OtamatoneComponent],
  imports: [],
  providers: [],
})
export class OtamatoneModule {}
