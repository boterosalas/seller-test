import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LoadingService, UserParametersService } from '@app/core';
import { DialogData } from '@app/secure/support-modal/support-modal.component';
import { ComponentsService, UserInformation } from '@app/shared';
import { TranslateService } from '@ngx-translate/core';
import { ListDownloadOrdersService } from './download-report-list-cancels.service';

@Component({
  selector: 'app-download-report-list-cancels',
  templateUrl: './download-report-list-cancels.component.html',
  styleUrls: ['./download-report-list-cancels.component.scss']
})
export class DownloadReportListCancelsComponent implements OnInit {

  public user: UserInformation;
  formListPending: FormGroup;
  public filtersList: any;

  // Configuración para el formato de fecha
  private locale = 'es-CO';

  constructor(
    public userParams: UserParametersService,
    private fb: FormBuilder,
    public componentService: ComponentsService,
    private languageService: TranslateService,
    private loadingService: LoadingService,
    public listDownloadOrdersService: ListDownloadOrdersService,
    public dialogRef: MatDialogRef<DownloadReportListCancelsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.filtersList = this.data;
  }

  ngOnInit() {
    this.getDataUser().then(data => {
      this.createForm();
    });
  }

  /**
   * Metodo para traer info del usuario
   * @memberof DownloadReportListCancelsComponent
   */
  async getDataUser() {
    this.user = await this.userParams.getUserData();
  }

  /**
   * Metodo para crear formulario
   * @memberof DownloadReportListCancelsComponent
   */
  createForm() {
    const email = this.user.sellerEmail;
    this.formListPending = this.fb.group({
      'email': [{ value: email, disabled: false }, Validators.compose([Validators.required, Validators.email])],
    });
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onNoClickOk(): void {
    this.dialogRef.close(true);
  }

  /**
   * Servicio descarga listado de cancelaciones
   * @memberof DownloadReportListCancelsComponent
   */
  sendExportDevolutionList() {
    this.loadingService.viewSpinner();
    let filterData;
    if (localStorage.getItem('currentFilter')) {
      filterData = JSON.parse(localStorage.getItem('currentFilter'));
    } else {
      filterData = null;
    }
    const dataToSend = {
      typeReport: this.filtersList.typeReport,
      sellerId: this.filtersList.sellerId ? this.filtersList.sellerId : null,
      email: this.formListPending.controls.email.value,
      filtersReport: filterData
    };
    this.listDownloadOrdersService.sendEmailExportListsCancel(dataToSend).subscribe(res => {
      if (res) {
        if (res.data === true) {
          this.componentService.openSnackBar(this.languageService.instant('secure.orders.list-cancels-tab1-msg-ok'), this.languageService.instant('actions.close'), 10000);
          this.onNoClick();
          this.loadingService.closeSpinner();
        } else {
          this.componentService.openSnackBar(this.languageService.instant('secure.orders.list-cancels-tab1-msg-ko'), this.languageService.instant('actions.close'), 5000);
          this.loadingService.closeSpinner();
        }
      } else {
        this.componentService.openSnackBar(this.languageService.instant('secure.orders.list-cancels-tab1-msg-ko'), this.languageService.instant('actions.close'), 5000);
        this.loadingService.closeSpinner();
      }
      localStorage.setItem('currentFilter', null);
    }, err => {
      this.componentService.openSnackBar(this.languageService.instant('secure.orders.list-cancels-tab1-msg-ko'), this.languageService.instant('actions.close'), 5000);
      this.loadingService.closeSpinner();
      this.onNoClick();
    });
  }

  /**
   * Servicio descarga historico de cancelaciones
   * @memberof DownloadReportListCancelsComponent
   */
  sendExportDevolutionHistoric() {
    this.loadingService.viewSpinner();
    let filterData;
    if (localStorage.getItem('currentFilter')) {
      filterData = JSON.parse(localStorage.getItem('currentFilter'));
    } else {
      filterData = null;
    }
    const datePipe = new DatePipe(this.locale);
    if (filterData && filterData.orderDate) {
      filterData.orderDate = datePipe.transform(filterData.orderDate, 'yyyy/MM/dd');
    }
    if (filterData && filterData.reversionDate) {
      filterData.reversionDate = datePipe.transform(filterData.reversionDate, 'yyyy/MM/dd');
    }
    if (filterData && filterData.resolutionDate) {
      filterData.resolutionDate = datePipe.transform(filterData.resolutionDate, 'yyyy/MM/dd');
    }
    const dataToSend = {
      typeReport: this.filtersList.typeReport,
      sellerId: this.filtersList.sellerId ? this.filtersList.sellerId : null,
      email: this.formListPending.controls.email.value,
      filtersReport: filterData
    };
    this.listDownloadOrdersService.sendEmailExportListsCancel(dataToSend).subscribe(res => {
      if (res) {
        if (res.data === true) {
          this.componentService.openSnackBar(this.languageService.instant('secure.orders.list-cancels-tab2-msg-ok'), this.languageService.instant('actions.close'), 10000);
          this.onNoClick();
          this.loadingService.closeSpinner();
        } else {
          this.componentService.openSnackBar(this.languageService.instant('secure.orders.list-cancels-tab2-msg-ko'), this.languageService.instant('actions.close'), 5000);
          this.loadingService.closeSpinner();
        }
      } else {
        this.componentService.openSnackBar(this.languageService.instant('secure.orders.list-cancels-tab2-msg-ko'), this.languageService.instant('actions.close'), 5000);
        this.loadingService.closeSpinner();
      }
      localStorage.setItem('currentFilter', null);
    }, err => {
      this.componentService.openSnackBar(this.languageService.instant('secure.orders.list-cancels-tab2-msg-ko'), this.languageService.instant('actions.close'), 5000);
      this.loadingService.closeSpinner();
      this.onNoClick();
    });
  }

}
