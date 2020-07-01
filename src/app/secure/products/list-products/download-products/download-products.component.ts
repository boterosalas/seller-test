import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserInformation } from '@app/shared';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserParametersService } from '@app/core';

export interface DialogData {
  data: any;
}


@Component({
  selector: 'app-download-products',
  templateUrl: './download-products.component.html',
  styleUrls: ['./download-products.component.scss']
})
export class DownloadProductsComponent implements OnInit {

  public user: UserInformation;
  myform: FormGroup;

  constructor(
    public userParams: UserParametersService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DownloadProductsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit() {
    this.getDataUser().then(data => {
      this.createForm();
    });
  }

  async getDataUser() {
    this.user = await this.userParams.getUserData();
  }

  createForm() {
    const email = this.user.sellerEmail;
    this.myform = this.fb.group({
      'email': [{ value: email, disabled: false }, Validators.compose([Validators.required, Validators.email])],
    });
  }
  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onNoClickOk(): void {
    this.dialogRef.close(true);
  }

}
