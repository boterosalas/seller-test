import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-dialog-desactive-offert',
  templateUrl: './dialog-desactive-offert.component.html',
  styleUrls: ['./dialog-desactive-offert.component.scss']
})
export class DialogDesactiveOffertComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogDesactiveOffertComponent>,

  ) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

}
