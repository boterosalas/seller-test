import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from '@app/secure/support-modal/support-modal.component';

@Component({
  selector: 'app-dialog-info',
  templateUrl: './dialog-info.component.html',
  styleUrls: ['./dialog-info.component.scss']
})
export class DialogInfoComponent implements OnInit {

  public icon: string;
  public title: string;
  public message: string;
  public cancelButtonText: string;
  public confirmButtonText: string;
  public dataInfo: any;

  constructor(
    public dialogRef: MatDialogRef<DialogInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.dataInfo = this.data;
   }

  ngOnInit() {
    this.setTextDialog();
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }
  
  setTextDialog(){
    console.log(this.dataInfo);
    if (this.dataInfo) {
      this.icon = this.dataInfo.dataDialog.icon || null;
      this.title = this.dataInfo.dataDialog.title || null;
      this.message = this.dataInfo.dataDialog.message || null;
      this.confirmButtonText = this.dataInfo.dataDialog.buttonText.ok || null;
      this.cancelButtonText = this.dataInfo.dataDialog.buttonText.cancel || null;
    }
  }

}
