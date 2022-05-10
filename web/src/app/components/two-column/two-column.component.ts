import { Component } from '@angular/core';

@Component({
  selector: 'app-two-column',
  template: `
    <mat-drawer-container class="h-full block">
      <mat-drawer mode="side" opened>
        <ng-content select="[sidebar]"></ng-content>
      </mat-drawer>
      <mat-drawer-content>
        <ng-content></ng-content>
      </mat-drawer-content>
    </mat-drawer-container>
  `,
  host: {
    class: 'h-full block',
  },
})
export class TwoColumn {}
