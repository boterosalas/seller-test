import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LoadingService } from '@app/core';
import { ComponentsService } from '@app/shared';
import { TranslateService } from '@ngx-translate/core';
import { SellerService } from '../../seller.service';

@Component({
  selector: 'app-modal-delete-agreement',
  templateUrl: './modal-delete-agreement.component.html',
  styleUrls: ['./modal-delete-agreement.component.scss']
})
export class ModalDeleteAgreementComponent implements OnInit {

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
    console.log('delete: ', this.data);
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  sendDataDeleteAllAgreement() {
    this.loadingService.viewSpinner();  
    const dataSend = `${this.data.dataAgreement.Id}/${this.data.dataAgreement.DocumentType}?`
    this.sellerService.deteleAllSellerAgreement(dataSend).subscribe((result: any) => {
      console.log('res: ', result);
      if (result.statusCode === 200) {
        const dataRes = JSON.parse(result.body).Data;
        if (dataRes) {
          this.componentService.openSnackBar('Elimino correctamente el acuerdo a los vendedores', this.languageService.instant('actions.close'), 5000);
          this.dialogRef.close(false);
          this.loadingService.closeSpinner();
        } else {
          this.loadingService.closeSpinner();
        }
      } else {
        this.loadingService.closeSpinner();
      }
    });
  }

}
