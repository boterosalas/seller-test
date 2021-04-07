import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from '@app/secure/support-modal/support-modal.component';
import { ListModalService } from './dialog-ingo.component.service';

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
  public name: any;
  public method: any;
  public dataToSend: any;

  constructor(
    public listModalService: ListModalService,
    public dialogRef: MatDialogRef<DialogInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.dataInfo = this.data;
   }

  ngOnInit() {
    this.setTextDialog();
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }
  
  setTextDialog(){
    console.log(this.dataInfo);
    if (this.dataInfo) {
      this.icon = this.dataInfo.icon || null;
      this.title = this.dataInfo.title || null;
      this.message = this.dataInfo.message || null;
      this.confirmButtonText = this.dataInfo.buttonText.ok || null;
      this.cancelButtonText = this.dataInfo.buttonText.cancel || null;
      this.name = this.dataInfo.services.name || null;
      this.method = this.dataInfo.services.method || null;
      this.dataToSend = this.dataInfo.data || null;
    }

  }

  sendDataPatch(){
    const body = {
      ean:123
    }
    this.listModalService.servicePatch(this.name, body).subscribe(res => {
      console.log(33, res);
    });
  }

}
