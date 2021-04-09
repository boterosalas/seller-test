import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-info-modal-support',
  templateUrl: './info-modal-support.component.html',
  styleUrls: ['./info-modal-support.component.scss']
})
export class InfoModalSupportComponent implements OnInit {

  dataInfoSupport:any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<InfoModalSupportComponent>,
  ) {
    this.dataInfoSupport = data;
   }

  ngOnInit() {
    
  }


  public close(): void {
    this.dialogRef.close();
  }

}
