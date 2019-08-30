import { Component, OnInit, Inject } from '@angular/core';
import { UserInformation, ComponentsService } from '@app/shared';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserParametersService, LoadingService } from '@app/core';
import { ReportOffertService } from '../report-offert.service';

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
    public reporOffertService: ReportOffertService,
    private loadingService: LoadingService,
    public componentService: ComponentsService,
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
    this.reporOffertService.downloadReportOffertAdmin(email).subscribe(
      (result: any) => {
        if (result && (result.status === 200 || result.status === 201)) {
          this.componentService.openSnackBar('Se ha realizado la descarga del reporte de ofertas correctamente, revisa tu correo electrónico en unos minutos.', 'Cerrar', 10000);
        } else {
          this.componentService.openSnackBar('Se ha presentado un error al realizar la descarga del reporte de ofertas', 'Cerrar', 5000);
        }
        this.onNoClick();
        this.loadingService.closeSpinner();
      }
    );
  }

}
