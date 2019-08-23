import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-case-modal',
  templateUrl: './response-case-dialog.component.html',
  styleUrls: ['./response-case-dialog.component.scss']
})
export class ResponseCaseDialogComponent {

  response = {
    id: null,
    description: null
  }

  constructor(
    public dialogRef: MatDialogRef<ResponseCaseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  submitResponse() {

    this.response.id = this.data.id;
    this.dialogRef.close({ data: this.response });
    this.dialogRef.afterClosed().subscribe(res => {
    });
  }
}
