import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Logger } from '@app/core';

const log = new Logger('CreateDialogComponent');

@Component({
  selector: 'app-create-dialog',
  templateUrl: './create-dialog.component.html',
  styleUrls: ['./create-dialog.component.scss']
})
export class CreateDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CreateDialogComponent>) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void { }
}
