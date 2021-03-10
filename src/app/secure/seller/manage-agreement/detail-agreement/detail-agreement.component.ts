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
  public limit = 50;
  public resultModel: any;
  public disabledBtn = false;


  public callOne = true;
  public arrayPosition = [];
  public paginationToken = '{}';
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

  public displayedColumns = [
    'all',
    'id',
    'nit',
    'name',
    'actions'
  ];

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
      console.log('params: ', params);
      this.getAllSellerAgreement(params);
    });
  }

  openModalDeleteAgreement(dataAgreement: any) {
    const dialogRef = this.dialog.open(ModalDeleteAgreementComponent, {
      width: '60%',
      minWidth: '280px',
      data: { dataAgreement, deleteMultiple: 1 }
    });
    dialogRef.afterClosed().subscribe(result => {
    this.getListbyParams();
      log.info('The modal detail billing was closed');
    });
  }

  getAllSellerAgreement(params: any) {
    this.loadingService.viewSpinner();
    let urlParams;
    if (params) {
      urlParams = `${params.docId}/${params.docType}?limit=${this.limit}&paginationToken=${encodeURI(this.paginationToken)}`
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

}
