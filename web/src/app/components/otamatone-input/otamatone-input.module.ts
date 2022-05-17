import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { OtamatoneModule } from 'components/otamatone';
import { OtamatoneInput } from './otamatone-input.component';

@NgModule({
  declarations: [OtamatoneInput],
  imports: [
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    OtamatoneModule,
  ],
  exports: [OtamatoneInput],
})
export class OtamatoneInputModule {}
