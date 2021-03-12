import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LoadingService, Logger } from '@app/core';
import { ComponentsService } from '@app/shared';
import { TranslateService } from '@ngx-translate/core';
import { SellerService } from '../../seller.service';

const log = new Logger('ModalDeleteAgreementComponent');

@Component({
  selector: 'app-modal-delete-agreement',
  templateUrl: './modal-delete-agreement.component.html',
  styleUrls: ['./modal-delete-agreement.component.scss']
})
export class ModalDeleteAgreementComponent implements OnInit {

  deleteOk = false;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ModalDeleteAgreementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private loadingService: LoadingService,
    private sellerService: SellerService,
    public componentService: ComponentsService,
    private languageService: TranslateService,
  ) { }

  ngOnInit() {
    console.log('data: ', this.data);
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  sendDataDeleteMultipleAgreement() {
    this.loadingService.viewSpinner();  
    const dataSend = {
      Id: this.data.dataAgreement.DocumentId,
      TypeContracts: this.data.dataAgreement.StatusContract,
      Sellers: [this.data.dataAgreement.SellerId]
    };
    console.log(dataSend);
    this.sellerService.deleteOneOrMore(dataSend).subscribe((result: any) => {
      if (result.statusCode === 200 || result.statusCode === 201) {
        const dataRes = JSON.parse(result.body);
        if (dataRes && dataRes.Data === true) {
          this.deleteOk = true;
          // this.componentService.openSnackBar('Elimino correctamente el acuerdo a los vendedores', this.languageService.instant('actions.close'), 5000);
          // this.dialogRef.close(false);
          this.loadingService.closeSpinner();
        } else {
          this.componentService.openSnackBar('Ocurrió un error al eliminar el acuerdo a los vendedores', this.languageService.instant('actions.close'), 5000);
          this.dialogRef.close(false);
          this.deleteOk = false;
          this.loadingService.closeSpinner();
        }
      } else {
        this.deleteOk = false;
        this.loadingService.closeSpinner();
      }
    });
  }

  sendDataDeleteAllAgreement() {
    this.loadingService.viewSpinner();  
    const dataSend = `${this.data.dataAgreement.Id}/${this.data.dataAgreement.DocumentType}?`
    this.sellerService.deteleAllSellerAgreement(dataSend).subscribe((result: any) => {
      if (result.statusCode === 200 || result.statusCode === 201) {
        const dataRes = JSON.parse(result.body);
        if (dataRes && dataRes.Data === true) {
          this.deleteOk = true;
          // this.componentService.openSnackBar('Elimino correctamente el acuerdo a los vendedores', this.languageService.instant('actions.close'), 5000);
          // this.dialogRef.close(false);
          this.loadingService.closeSpinner();
        } else {
          this.componentService.openSnackBar('Ocurrió un error al eliminar el acuerdo a los vendedores', this.languageService.instant('actions.close'), 5000);
          this.dialogRef.close(false);
          this.deleteOk = false;
          this.loadingService.closeSpinner();
        }
      } else {
        this.deleteOk = false;
        this.loadingService.closeSpinner();
      }
    });
  }

}
