import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { TwoColumn } from './two-column.component';

@NgModule({
  declarations: [TwoColumn],
  imports: [MatSidenavModule],
  exports: [TwoColumn],
})
export class TwoColumnModule {}
