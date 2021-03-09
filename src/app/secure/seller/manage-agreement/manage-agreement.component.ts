import { Component, OnInit } from '@angular/core';
import { MatDialog, PageEvent } from '@angular/material';
import { LoadingService, Logger, ModalService } from '@app/core';
import { ComponentsService } from '@app/shared';
import { TranslateService } from '@ngx-translate/core';
import { SellerService } from '../seller.service';
import { ModalBulkloadAgreementComponent } from './modal-bulkload-agreement/modal-bulkload-agreement.component';
import { ModalDeleteAgreementComponent } from './modal-delete-agreement/modal-delete-agreement.component';

const log = new Logger('ManageAgreementComponent');

@Component({
  selector: 'app-manage-agreement',
  templateUrl: './manage-agreement.component.html',
  styleUrls: ['./manage-agreement.component.scss']
})
export class ManageAgreementComponent implements OnInit {

  manageAgreementsSeller: any;

  public paginationToken = '{}';
  public limit = 0;
  titleAgreement: any;
  length = 0;
  public pageSize = 50;

  public arrayPosition = [];
  paramsArray: any;
  pageSizeOptions: number[] = [50, 100, 200];
  pageEvent: PageEvent;
  public callOne = true;


  constructor(
    private dialog: MatDialog,
    private sellerService: SellerService,
    private loading: LoadingService,
    private modalService: ModalService,
    public componentService: ComponentsService,
    private languageService: TranslateService,
  ) { }

  ngOnInit() {
    this.getAgreemet();
  }

  activeContract(event: any, data: any) {
    this.loading.viewSpinner();
    console.log('ev: ', event);
    if (event && event.checked === true) {
      console.log('es tru', data);
      const dataSend = `${data.Id}/${data.DocumentType}?`
      this.sellerService.activeAgreementDefault(dataSend).subscribe((result: any) => {
        console.log('defaul: ', result);
        const res = JSON.parse(result.body);
        if (res && res.Data === true) {
          this.componentService.openSnackBar('Se ha actualizado el contrato predeterminado', this.languageService.instant('actions.close'), 5000);
          this.getAgreemet();
          this.loading.closeSpinner();
        } else {
          this.componentService.openSnackBar('Se ha presentado un error al actualizar el contrato predeterminado', this.languageService.instant('actions.close'), 5000);
        }
      });
    } else {
      console.log('es false');
    }
  }

  /**
   * Funcion para abrir modal para agregar masivamente acuerdos
   * @memberof ManageAgreementComponent
   */
  openModalBulkLoadAgreement() {
    const dialogRef = this.dialog.open(ModalBulkloadAgreementComponent, {
      width: '60%',
      minWidth: '280px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      log.info('The modal detail billing was closed');
    });
  }

  /**
   * Modal para abrir y eliminar Todos los 
   * @memberof ManageAgreementComponent
   */
  openModalDeleteAgreement(dataAgreement: any) {
    const dialogRef = this.dialog.open(ModalDeleteAgreementComponent, {
      width: '60%',
      minWidth: '280px',
      data: { dataAgreement }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('close dialog', result);
      log.info('The modal detail billing was closed');
    });
  }

  /**
   * Metodo para obtener todas las marcas
   * @param {*} [params]
   * @memberof ManageAgreementComponent
   */
  public getAgreemet(params?: any) {
    this.loading.viewSpinner();
    let urlParams;
    if (params) {
      urlParams = params;
    } else {
      urlParams = `?limit=${this.pageSize}&paginationToken=${encodeURI(this.paginationToken)}`
    }
    this.sellerService.getAllAgreement(urlParams).subscribe((result: any) => {
      if (result) {
        this.manageAgreementsSeller = result.ViewModel;
        this.titleAgreement = result.ContractName;
        if (this.callOne) {
          this.length = result.Count;
          this.arrayPosition = [];
          this.arrayPosition.push('{}');
          this.callOne = false;
        }
        this.paginationToken = result.PaginationToken;
        this.loading.closeSpinner();
      }
    }, error => {
      this.loading.closeSpinner();
      this.modalService.showModal('errorService');
    });
  }

  /**
   * Evento para controlar la paginacion
   * @param {*} event
   * @returns {*}
   * @memberof ManageAgreementComponent
   */
  paginations(event: any): any {
    if (event.pageSize !== this.limit) {
      this.limit = event.pageSize;
    }
    if (event && event.pageIndex >= 0) {
      const index = event.pageIndex;
      if (index === 0) {
        this.paginationToken = encodeURI('{}');
      }
      const isExistInitial = this.arrayPosition.includes('{}');
      if (isExistInitial === false) {
        this.arrayPosition.push('{}');
      }
      const isExist = this.arrayPosition.includes(this.paginationToken);
      if (isExist === false) {
        this.arrayPosition.push(this.paginationToken);
      }
      this.paginationToken = this.arrayPosition[index];
      if (this.paginationToken === undefined) {
        this.paginationToken = encodeURI('{}');
      }
      this.paramsArray = {
        'limit': this.limit + '&paginationToken=' + this.paginationToken
      };
      this.getAgreemet();
    }
  }

}
