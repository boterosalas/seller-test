import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common'
import { LoadingService, Logger } from '@app/core';
import { MatDialog, MatSidenav, MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { SellerService } from '../../seller.service';
import { ActivatedRoute } from '@angular/router';
import { ModalDeleteAgreementComponent } from '../modal-delete-agreement/modal-delete-agreement.component';

const log = new Logger('DetailAgreementComponent');

@Component({
  selector: 'app-detail-agreement',
  templateUrl: './detail-agreement.component.html',
  styleUrls: ['./detail-agreement.component.scss']
})
export class DetailAgreementComponent implements OnInit {

  public statusAllCheck = true;
  public arrayNotSelect = [];
  public subModalLoad: any;
  // public limit = 50;
  public resultModel: any;
  public disabledBtn = false;

  public paginationToken = '{}';
  public limit = 0;
  titleAgreement: any;
  // length = 0;
  public pageSize = 50;
  pageSizeOptions: number[] = [50, 100, 200];


  public callOne = true;
  public arrayPosition = [];
  // public paginationToken = '{}';
  public arraySelect = [];
  public all = false;
  public disabledCheckTempor = false;
  public isAllSelectedCurrent = false;

  @ViewChild('sidenav') sidenav: MatSidenav;
  public dataSource: MatTableDataSource<any>;
  public selection = new SelectionModel<any>(true, []);
  public initialSellerList: any;
  public mapInitialSellerList: any;
  public length = 0;

  paramsArray: any;

  public displayedColumns = [
    'all',
    'id',
    'nit',
    'name',
    'actions'
  ];
  docId: any;
  docType: any;
  docName: any;

  constructor(
    private location: Location,
    public loadingService: LoadingService,
    private sellerService: SellerService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    console.log('redirect detalle acuerdos');
    // this.route.params.subscribe(params => {
    //   console.log('params: ', params);
    //   this.getAllSellerAgreement(params);
    // });
    this.getListbyParams();
  }

  /**
   * Funcion para volver al listado de acuerdos / anexos
   * @memberof DetailAgreementComponent
   */
  goBack(): void {
    this.location.back();
  }

  /**
   * Metodo para traer los parametros de la ruta y hacer el get del listado
   * @memberof DetailAgreementComponent
   */
  getListbyParams(){
    this.route.params.subscribe(params => {
      this.docId = params.docId;
      this.docType = params.docType;
      this.docName = params.name;
      this.getAllSellerAgreement(params);
    });
  }

  /**
   * Metodo para abrir dialogo y eliminar un solo vendedor al acuerdo
   * @param {*} dataAgreement
   * @memberof DetailAgreementComponent
   */
  openModalDeleteAgreement(dataAgreement: any) {
    const dialogRef = this.dialog.open(ModalDeleteAgreementComponent, {
      width: '60%',
      minWidth: '280px',
      data: { dataAgreement, deleteMultiple: 1, name:  this.docName}
    });
    dialogRef.afterClosed().subscribe(result => {
    this.allClear();
    this.getListbyParams();
    this.callOne = true;
      log.info('The modal detail billing was closed');
    });
  }

  /**
   * Metodo apra abrir dialogo de eliminar varios vendedores al acuerdo
   * @memberof DetailAgreementComponent
   */
  openModalDeleteMultipleAgreement() {
    let arraySellers = [];
    this.arraySelect.forEach(el => {
      if (el.SellerId) {
        arraySellers.push(el.SellerId);
      }
    });
    const dataAgreement = {
      Id: this.docId,
      TypeContracts: this.docType,
      Sellers: arraySellers
    }; 
    const dialogRef = this.dialog.open(ModalDeleteAgreementComponent, {
      width: '60%',
      minWidth: '280px',
      data: { dataAgreement, deleteMultiple: 2 , name:  this.docName}
    });
    dialogRef.afterClosed().subscribe(result => {
    this.allClear();
    this.getListbyParams();
    this.callOne = true;
      log.info('The modal detail billing was closed');
    });
  }

  /**
   * Metodo get que obtiene el listado de los vendedores asociados a un acuerdo / anexo
   * @param {*} [params]
   * @memberof DetailAgreementComponent
   */
  getAllSellerAgreement(params?: any) {
    console.log('this.paginationToken: ', this.paginationToken);
    this.loadingService.viewSpinner();
    let urlParams;
    if (params) {
      urlParams = `${params.docId}/${params.docType}?limit=${this.pageSize}&paginationToken=${encodeURI(this.paginationToken)}`
    } else {
      this.paginationToken = encodeURI(this.paginationToken);
      urlParams = this.docId + `/` + this.docType + `?limit=${this.limit}&paginationToken=` + this.paginationToken;
    }
    console.log('res: ', urlParams);
    this.sellerService.getListSellers(urlParams).subscribe((result: any) => {
      if (result) {
        console.log('res: ', result);
        this.resultModel = result.body;
        if (this.callOne) {
          this.length = result.Count;
          this.arrayPosition = [];
          this.arrayPosition.push('{}');
          this.callOne = false;
        }
        this.dataSource = new MatTableDataSource(result.ViewModel);
        if (this.arraySelect.length > 0) {
          this.arraySelect.forEach(select => {
            this.dataSource.data.forEach(rowGen => {
              if (rowGen.Id === select.Id) {
                this.selection.select(rowGen);
              }
            });
          });
        }
        if (this.all) {
          this.dataSource.data.forEach(row => this.selection.select(row));
        }
        if (this.arrayNotSelect.length > 0) {
          this.arrayNotSelect.forEach(select => {
            this.dataSource.data.forEach(rowGen => {
              if (rowGen.Id === select.Id) {
                this.selection.deselect(rowGen);
              }
            });
          });
        }
        this.paginationToken = result.PaginationToken ? result.PaginationToken : '{}';
        this.loadingService.closeSpinner();
      } else {
        this.loadingService.closeSpinner();
      }
    });
  }

  /**
   * metodo de paginación
   * @param {*} event
   * @returns {*}
   * @memberof DetailAgreementComponent
   */
  paginations(event: any): any {
    if (event.pageSize !== this.limit) {
      this.limit = event.pageSize;
    }
    if (event && event.pageIndex >= 0) {
      console.log('event: ', event);
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
      this.getAllSellerAgreement();
    }
  }

  // /**
  //  * Metodo para validar todos los check del listado
  //  * @memberof DetailAgreementComponent
  //  */
  // isAllSelected() {
  //   const numSelected = this.selection.selected.length;
  //   const numRows = this.dataSource.data.length;
  //   if (numSelected === numRows) {
  //     this.isAllSelectedCurrent = true;
  //   } else {
  //     this.isAllSelectedCurrent = false;
  //   }
  //   if (this.arraySelect.length === 0 && !this.all) {
  //     this.selection.clear();
  //     this.all = false;
  //     this.statusAllCheck = true;
  //   }
  // }

  /**
   * Metodo para cambiar estados de los check
   * @param {*} row
   * @param {*} status
   * @memberof DetailAgreementComponent
   */
  public changeStatus(row: any, status: any) {
    this.disabledBtn = true;
    if (row) {
      if (status) {
        this.arraySelect.push(row);
        this.disabledBtn = false;
      } else {
        const index = this.arraySelect.findIndex(rows => rows.Id === row.Id);
        this.arraySelect.splice(index, 1);
        this.selection.deselect(row);
      }
      if (!this.statusAllCheck) {
        if (status) {
          const index = this.arrayNotSelect.findIndex(rows => rows === row);
          this.arrayNotSelect.splice(index, 1);
          this.selection.deselect(row);
        } else {
          this.arrayNotSelect.push(row);
          this.disabledBtn = false;
        }
      } else {
        this.arrayNotSelect = [];
      }
    } else {
      this.all = status;
      this.disabledBtn = false;
    }
    // this.isAllSelected();
  }

  /**
   * Metodo para limpiar variable
   * @memberof DetailAgreementComponent
   */
  allClear() {
    this.paginationToken = '{}';
    this.arrayNotSelect = [];
    this.arraySelect = [];
    this.arrayPosition = [];
    this.all = false;
    this.selection.clear();
    this.dialog.closeAll();
    this.statusAllCheck = true;
  }

}
