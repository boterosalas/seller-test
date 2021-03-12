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

  goBack(): void {
    this.location.back();
  }

  getListbyParams(){
    this.route.params.subscribe(params => {
      this.docId = params.docId;
      this.docType = params.docType;
      this.docName = params.name;
      this.getAllSellerAgreement(params);
    });
  }

  openModalDeleteAgreement(dataAgreement: any) {
    const dialogRef = this.dialog.open(ModalDeleteAgreementComponent, {
      width: '60%',
      minWidth: '280px',
      data: { dataAgreement, deleteMultiple: 1, name:  this.docName}
    });
    dialogRef.afterClosed().subscribe(result => {
    this.allClear();
    this.getListbyParams();
      log.info('The modal detail billing was closed');
    });
  }

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
      log.info('The modal detail billing was closed');
    });
  }

  getAllSellerAgreement(params?: any) {
    this.loadingService.viewSpinner();
    let urlParams;
    if (params) {
      urlParams = `${params.docId}/${params.docType}?limit=${this.pageSize}&paginationToken=${encodeURI(this.paginationToken)}`
    }
    this.sellerService.getListSellers(urlParams).subscribe((result: any) => {
      if (result) {
        this.resultModel = JSON.parse(result.body);
        if (this.callOne) {
          this.length = this.resultModel.Count;
          this.arrayPosition = [];
          this.arrayPosition.push('{}');
          this.callOne = false;
        }
        this.dataSource = new MatTableDataSource(this.resultModel.ViewModel);
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
        this.paginationToken = this.resultModel.PaginationToken ? this.resultModel.PaginationToken : '{}';
        this.loadingService.closeSpinner();
      } else {
        this.loadingService.closeSpinner();
      }
    });
  }

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
      this.getAllSellerAgreement();
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    if (numSelected === numRows) {
      this.isAllSelectedCurrent = true;
    } else {
      this.isAllSelectedCurrent = false;
    }
    if (this.arraySelect.length === 0 && !this.all) {
      this.selection.clear();
      this.all = false;
      this.statusAllCheck = true;
    }
  }

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
    this.isAllSelected();
  }

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
