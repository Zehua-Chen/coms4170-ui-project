import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-two-column',
  templateUrl: './two-column.component.html',
  styleUrls: ['./two-column.component.scss'],
})
export class TwoColumn {
  @HostBinding('class')
  get className(): string {
    return 'grow flex flex-row items-start';
  }
}
