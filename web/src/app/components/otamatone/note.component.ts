import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: '[note]',
  template: `
    <svg:circle
      class="button"
      [class.disabled]="disabled"
      [attr.cy]="stickHeight / 2"
      [attr.r]="buttonSize / 2"
      (click)="play.emit()"
    ></svg:circle>
    <svg:text
      class="button-label"
      [class.disabled]="disabled"
      text-anchor="middle"
      y="-20"
    >
      {{ label }}
    </svg:text>
  `,
  styleUrls: ['./note.component.scss'],
})
export class Note {
  @Input()
  label: string = '';

  @Input()
  disabled: boolean = false;

  @Input()
  buttonSize: number = 10;

  @Input()
  stickHeight: number = 10;

  @Output()
  play: EventEmitter<void> = new EventEmitter();
}
