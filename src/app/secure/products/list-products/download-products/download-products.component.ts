import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface DialogData {
  data: any;
}


@Component({
  selector: 'app-download-products',
  templateUrl: './download-products.component.html',
  styleUrls: ['./download-products.component.scss']
})
export class DownloadProductsComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DownloadProductsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit() {
  }

}
