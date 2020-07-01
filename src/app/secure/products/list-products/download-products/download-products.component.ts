import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserInformation } from '@app/shared';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserParametersService } from '@app/core';
import { ListProductService } from '../list-products.service';

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
  public filtersList: any;

  constructor(
    public userParams: UserParametersService,
    private fb: FormBuilder,
    private productsService: ListProductService,
    public dialogRef: MatDialogRef<DownloadProductsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    console.log('data: ', data);
  }

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

  /**
   * Metodo para enviar datos al servicio y descargar el reporte.
   * @memberof DownloadProductsComponent
   */
  sendExportProducts() {
    this.filtersList = this.data;
    const dataToSend = {
      email: this.myform.controls.email.value,
      filterList: this.filtersList
    };
    console.log('dataTosend: ', dataToSend);
    this.productsService.sendEmailExportProducts(dataToSend).subscribe((res: any) => { });
  }

  public getDate(date: any): any {
    const day = this.addsZeroDate(date.getDate().toString());
    const months = this.addsZeroDate((date.getMonth() + 1).toString());
    const year = date.getFullYear();

    return day + '-' + months + '-' + year;
  }

  public addsZeroDate(param: any): any {
    if (param.length < 2) {
      return '0' + param;
    }
    return param;
  }

}
