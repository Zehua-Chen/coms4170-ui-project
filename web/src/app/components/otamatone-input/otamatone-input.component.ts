import { Component, Input, Output, EventEmitter } from '@angular/core';

import { EnabledNotes, Note } from 'components/otamatone';

@Component({
  selector: 'app-otamatone-input,[app-otamatone-input]',
  templateUrl: './otamatone-input.component.html',
})
export class OtamatoneInput {
  @Input()
  enabledNotes: EnabledNotes = 'all';

  @Input()
  maxNotes: number = 0;

  @Input()
  notes: Note[] = [];

  @Output()
  notesChange: EventEmitter<Note[]> = new EventEmitter();

  onPlay(note: Note) {
    if (this.maxNotes >= 1 && this.notes.length == this.maxNotes) {
      this.notes = [note];
    } else {
      this.notes = [...this.notes, note];
    }

    this.notesChange.emit(this.notes);
  }

  reset() {
    this.notes = [];
    this.notesChange.emit(this.notes);
  }
}
