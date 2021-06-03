import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-modal-advertisements',
  templateUrl: './modal-advertisements.component.html',
  styleUrls: ['./modal-advertisements.component.scss']
})
export class ModalAdvertisementsComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ModalAdvertisementsComponent>,
  ) { }

  ngOnInit() {
  }

  /**
   * cierra la modal
   */

   public close(): void {
    this.dialogRef.close();
  }

}
