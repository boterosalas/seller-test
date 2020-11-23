import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { LoadingService, UserParametersService } from '@app/core';
import { ParamSpecsService } from '@app/secure/parameterize/specifications/specifications.component.service';
import { ComponentsService, UserInformation } from '@app/shared';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-download-categories',
  templateUrl: './download-categories.component.html',
  styleUrls: ['./download-categories.component.scss']
})
export class DownloadCategoriesComponent implements OnInit {

  public user: UserInformation;
  myform: FormGroup;

  constructor(
    public userParams: UserParametersService,
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private paramSpecsService: ParamSpecsService,
    public componentsService: ComponentsService,
    private languageService: TranslateService,
    public dialogRef: MatDialogRef<DownloadCategoriesComponent>,
  ) { }

  ngOnInit() {
    this.getDataUser().then(data => {
      this.createForm();
    });
  }

  async getDataUser() {
    this.user = await this.userParams.getUserData();
  }

  /**
   * Metodo para crear formulario
   * @memberof DownloadCategoriesComponent
   */
  createForm() {
    const email = this.user.sellerEmail;
    this.myform = this.fb.group({
      'email': [{ value: email, disabled: false }, Validators.compose([Validators.required, Validators.email])],
    });
  }

  /**
   * Metodo cuando limpiar data y se cierra el modal
   * @memberof DownloadCategoriesComponent
   */
  onNoClick(): void {
    this.dialogRef.close(false);
  }

  /**
   * Metodo cuando limpiar data y se cierra el modal
   * @memberof DownloadCategoriesComponent
   */
  onNoClickOk(): void {
    this.dialogRef.close(true);
  }

  /**
   * Metodo para descargar specificaciones
   * @memberof DownloadCategoriesComponent
   */
  sendExportDownloadCategories() {
    // this.loadingService.viewSpinner();
    // const urlParams = '?email=' + this.myform.controls.email.value;
    // this.paramSpecsService.getDownloadSpecs(urlParams).subscribe((res: any) => {
    //   if (res != null) {
    //     if (res.data === true) {
    //       this.componentsService.openSnackBar(this.languageService.instant('secure.parametize.specifications.download_OK'), this.languageService.instant('actions.close'), 10000);
    //       this.onNoClick();
    //       this.loadingService.closeSpinner();
    //     } else {
    //       this.componentsService.openSnackBar(this.languageService.instant('secure.parametize.specifications.download_KO'), this.languageService.instant('actions.close'), 5000);
    //       this.loadingService.closeSpinner();
    //     }
    //   } else {
    //     this.componentsService.openSnackBar(this.languageService.instant('secure.parametize.specifications.download_KO'), this.languageService.instant('actions.close'), 5000);
    //     this.loadingService.closeSpinner();
    //   }
    // }, err => {
    //   this.componentsService.openSnackBar(this.languageService.instant('secure.parametize.specifications.download_KO'), this.languageService.instant('actions.close'), 5000);
    //   this.loadingService.closeSpinner();
    //   this.onNoClick();
    // });
  }

}
