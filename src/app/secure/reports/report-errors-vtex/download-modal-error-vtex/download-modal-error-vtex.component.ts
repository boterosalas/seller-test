import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { LoadingService, UserParametersService } from '@app/core';
import { ComponentsService, UserInformation } from '@app/shared';
import { TranslateService } from '@ngx-translate/core';
import { ReportOffertService } from '../../report-offert/report-offert.service';

@Component({
  selector: 'app-download-modal-error-vtex',
  templateUrl: './download-modal-error-vtex.component.html',
  styleUrls: ['./download-modal-error-vtex.component.scss']
})
export class DownloadModalErrorVtexComponent implements OnInit {


public user: UserInformation;
public myform: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DownloadModalErrorVtexComponent>,
    private fb: FormBuilder,
    public userParams: UserParametersService,
    public reporOffertService: ReportOffertService,
    private loadingService: LoadingService,
    public componentService: ComponentsService,
    private languageService: TranslateService,

  ) { }

  ngOnInit() {
    this.getDataUser().then(data => {
      this.createForm();
    });
  }

  async getDataUser() {
    this.user = await this.userParams.getUserData();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  createForm() {
    const email = this.user.sellerEmail;
    this.myform = this.fb.group({
      'email': [{ value: email, disabled: false }, Validators.compose([Validators.required, Validators.email])],
    });
  }


  downloadReportOffertADmin(form: any) {
    const email = form.get('email').value;
    this.loadingService.viewSpinner();
    this.reporOffertService.downloadReportErrorVtexAdmin(email).subscribe(
      (result: any) => {
        console.log(result);
        // if (result && (result.status === 200 || result.status === 201)) {
        //   this.componentService.openSnackBar(this.languageService.instant('secure.reports.report-offert.download-modal-offert-ts.ok'), this.languageService.instant('actions.close'), 10000);
        // } else {
        //   this.componentService.openSnackBar(this.languageService.instant('secure.reports.report-offert.download-modal-offert-ts.ko'), this.languageService.instant('actions.close'), 5000);
        // }
        this.onNoClick();
        this.loadingService.closeSpinner();
      }
    );
  }

}
