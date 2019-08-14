import { Component, OnInit, Inject } from '@angular/core';
import { UserInformation } from '@app/shared';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserParametersService, LoadingService } from '@app/core';

@Component({
  selector: 'app-download-modal-offert-report',
  templateUrl: './download-modal-offert-report.component.html',
  styleUrls: ['./download-modal-offert-report.component.scss']
})
export class DownloadModalOffertReportComponent implements OnInit {

  // user info
  public user: UserInformation;

  // Formulario correo
  myform: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DownloadModalOffertReportComponent>,
    private fb: FormBuilder,
    public userParams: UserParametersService,
    private loadingService: LoadingService,
    @Inject(MAT_DIALOG_DATA) public data: any
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
    this.dialogRef.close();
  }

}
