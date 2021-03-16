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
  }

  /**
   * Funcion cerrar modal
   * @memberof ModalDeleteAgreementComponent
   */
  onNoClick(): void {
    this.dialogRef.close(false);
  }

  /**
   * Metodo escucha cual funcion enviar a eliminar, todos, varios o uno
   * @memberof ModalDeleteAgreementComponent
   */
  deleteSeller() {
    if (this.data && this.data.deleteMultiple === 0) {
      this.sendDataDeleteAllAgreement();
    } else if (this.data && this.data.deleteMultiple === 1) {
      this.sendDataDeleteOneAgreement();
    } else if (this.data && this.data.deleteMultiple === 2) {
      this.sendDataDeleteMultipleAgreement();
    }
  }

  /**
   * Metodo para eliminar un vendedor a un acuerdo
   * @memberof ModalDeleteAgreementComponent
   */
  sendDataDeleteOneAgreement() {
    this.loadingService.viewSpinner();
    const dataSend = {
      Id: this.data.dataAgreement.DocumentId,
      TypeContracts: this.data.dataAgreement.DocumentType,
      Sellers: [this.data.dataAgreement.SellerId]
    };
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

  /**
   * Metodo para eliminar varios vendedores a un acuerdo
   * @memberof ModalDeleteAgreementComponent
   */
  sendDataDeleteMultipleAgreement() {
    this.loadingService.viewSpinner();
    const dataSend = this.data.dataAgreement;
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

  /**
   * Metodo para eliminar todos los vendedores al acuerdo
   * @memberof ModalDeleteAgreementComponent
   */
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

  /**
   * Metodo para desytruir el componente
   * @memberof ModalDeleteAgreementComponent
   */
  ngOnDestroy() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

}
