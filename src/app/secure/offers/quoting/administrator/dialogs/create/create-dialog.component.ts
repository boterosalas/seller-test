import { Component, OnInit } from '@angular/core';
import { Logger } from '@app/core';
import { EventEmitterDialogs } from './../../events/eventEmitter-dialogs.service';

const log = new Logger('CreateDialogComponent');

@Component({
  selector: 'app-create-dialog',
  templateUrl: './create-dialog.component.html',
  styleUrls: ['./../dialog.component.scss']
})
export class CreateDialogComponent implements OnInit {

  constructor(
    private events: EventEmitterDialogs
  ) { }

  ngOnInit(): void { }

  closeDialog(): void {
    this.events.openDialogCreate(false);
  }
}
