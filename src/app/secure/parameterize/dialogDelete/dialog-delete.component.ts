import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

/**
 * @title Dialog Overview
 */
@Component({
  selector: 'app-delete-dialog-specs',
  templateUrl: './dialog-delete.component.html',
  styleUrls: ['./dialog-delete.component.scss']
})
export class DeleteDialogSpecsComponent implements OnInit {

  public typeSpecsDelete: boolean;

  constructor(
    public dialogRef: MatDialogRef<DeleteDialogSpecsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.typeSpecsDelete = (data !== null);
  }

  ngOnInit() {
  }

  /**
   * Close dialog and if confirm send to another component this answer
   *
   * @param {boolean} confirm
   * @memberof DeleteDialogComponent
   */
  closeDialog(confirm: boolean): void {
    this.dialogRef.close(confirm);
  }


}

