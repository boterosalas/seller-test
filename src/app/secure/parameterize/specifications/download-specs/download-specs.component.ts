import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LoadingService, UserParametersService } from '@app/core';
import { DialogData } from '@app/secure/support-modal/support-modal.component';
import { ComponentsService, UserInformation } from '@app/shared';
import { TranslateService } from '@ngx-translate/core';
import { ParamSpecsService } from '../specifications.component.service';

@Component({
  selector: 'app-download-specs',
  templateUrl: './download-specs.component.html',
  styleUrls: ['./download-specs.component.scss']
})
export class DownloadSpecsComponent implements OnInit {

  public user: UserInformation;
  myform: FormGroup;
  public filtersList: any;

  constructor(
    public userParams: UserParametersService,
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private paramSpecsService: ParamSpecsService,
    public componentsService: ComponentsService,
    private languageService: TranslateService,
    public dialogRef: MatDialogRef<DownloadSpecsComponent>,
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

  /**
   * Metodo para crear formulario
   * @memberof DownloadSpecsComponent
   */
  createForm() {
    const email = this.user.sellerEmail;
    this.myform = this.fb.group({
      'email': [{ value: email, disabled: false }, Validators.compose([Validators.required, Validators.email])],
    });
  }

  /**
   * Metodo cuando limpiar data y se cierra el modal
   * @memberof DownloadSpecsComponent
   */
  onNoClick(): void {
    this.dialogRef.close(false);
  }

  /**
   * Metodo cuando limpiar data y se cierra el modal
   * @memberof DownloadSpecsComponent
   */
  onNoClickOk(): void {
    this.dialogRef.close(true);
  }

  /**
   * Metodo para descargar specificaciones
   * @memberof DownloadSpecsComponent
   */
  sendExportDownload() {
    this.loadingService.viewSpinner();
    this.filtersList = this.data;
    const dataToSend = {
      email: this.myform.controls.email.value,
    };
    // this.productsService.sendEmailExportProducts(dataToSend).subscribe((res: any) => {
    //   if (res != null) {
    //     if (res.data === true) {
    //       this.componentsService.openSnackBar(this.languageService.instant('secure.products.list_products.download.ok'), this.languageService.instant('actions.close'), 10000);
    //       this.onNoClick();
    //       this.loadingService.closeSpinner();
    //     } else {
    //       this.componentsService.openSnackBar(this.languageService.instant('secure.products.list_products.download.error'), this.languageService.instant('actions.close'), 5000);
    //       this.loadingService.closeSpinner();
    //     }
    //   } else {
    //     this.componentsService.openSnackBar(this.languageService.instant('secure.products.list_products.download.error'), this.languageService.instant('actions.close'), 5000);
    //     this.loadingService.closeSpinner();
    //   }
    // }, err => {
    //   this.componentsService.openSnackBar(this.languageService.instant('secure.products.list_products.download.error'), this.languageService.instant('actions.close'), 5000);
    //   this.loadingService.closeSpinner();
    //   this.onNoClick();
    // });
  }

}
