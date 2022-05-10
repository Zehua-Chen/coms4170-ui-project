import { Component } from '@angular/core';

@Component({
  selector: 'app-two-column',
  template: `
    <!--
      components are rendered inline, therefore to make it full width, we
      must apply
      - h-full
      - block
    -->
    <mat-drawer-container class="h-full block">
      <mat-drawer mode="side" opened>
        <ng-content select="[sidebar]"></ng-content>
      </mat-drawer>
      <mat-drawer-content>
        <ng-content></ng-content>
      </mat-drawer-content>
    </mat-drawer-container>
  `,
})
export class TwoColumn {}
