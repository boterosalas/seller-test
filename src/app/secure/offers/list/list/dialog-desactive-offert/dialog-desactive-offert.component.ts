import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Logger } from '@app/core';

const log = new Logger('SupportModalComponent');

export interface DialogData {
  data: any;
}

@Component({
  selector: 'app-dialog-desactive-offert',
  templateUrl: './dialog-desactive-offert.component.html',
  styleUrls: ['./dialog-desactive-offert.component.scss']
})
export class DialogDesactiveOffertComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogDesactiveOffertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onNoClickOk(): void {
    this.dialogRef.close(true);
  }

}
