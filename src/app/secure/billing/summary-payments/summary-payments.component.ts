import { Component, OnInit, ViewChild } from '@angular/core';
import { SearchFormEntity, InformationToForm } from '@app/shared';
import { MatSidenav, MatTableDataSource } from '@angular/material';
import { OrderService } from '@app/secure/orders/orders-list/orders.service';
import { LoadingService } from '@app/core';
import { MyProfileService } from '@app/secure/aws-cognito/profile/myprofile.service';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-summary-payments',
  templateUrl: './summary-payments.component.html',
  styleUrls: ['./summary-payments.component.scss']
})
export class SummaryPaymentsComponent implements OnInit {

  public stateSideNavOrder = false;

  public statusAllCheck = true;
  public arrayNotSelect = [];
  public subModalLoad: any;
  public limit = 10;
  public resultModel: any;
  public length = 0;
  public dataSource: MatTableDataSource<any>;
  public selection = new SelectionModel<any>(true, []);
  public arraySelect = [];


  public callOne = true;
  public arrayPosition = [];
  public paginationToken = '{}';

  public displayedColumns = [
    'check',
    'number_bill',
    'quantity_orders',
    'payment_date',
    'total_discounted_value',
    'total_to_pay'
  ];

   // Configuración para el toolbar-options y el search de la pagina
   public informationToForm: SearchFormEntity = {
    title: 'module.Facturación',
    subtitle: 'menu.Resumen de Pagos',
    btn_title: 'secure.billing.summaryPayment.search_summaryPayment',
    title_for_search: 'secure.billing.summaryPayment.search_summaryPayment',
    type_form: 'summaryPayment',
    information: new InformationToForm,
    count: null
  };

  public pageSize = 10;
  public querySearch = '';
  public idSeller= '';


  constructor(
    private orderService: OrderService,
    public loadingService: LoadingService,
    private profileService: MyProfileService,
  ) { }

  ngOnInit() {
    const paramsArray = {
      'limit': this.pageSize + '&paginationToken=' + encodeURI('{}'),
      'idSeller': 11216,
      'state': null,
      'callOne': true
    };
    this.getAllSeller(paramsArray);
    this.getAllDataUser();
  }

  async getAllDataUser() {
    const sellerData = await this.profileService.getUser().toPromise().then(res => {
      const body: any = res.body;
      const response = JSON.parse(body.body);
      const userData = response.Data;
      this.loadingService.closeSpinner();
      return userData;
    });
    if (sellerData && sellerData.IdSeller) {
      this.idSeller = sellerData.IdSeller;
    }
  }

  /**
   * funcion para capturar todos los seller paginados
   *
   * @param {*} [params]
   * @memberof UploadAgreementComponent
   */
  getAllSeller(params?: any) {
    this.loadingService.viewSpinner();
    if (params === undefined) {
      params = {
        'limit': this.limit + '&paginationToken=' + encodeURI(this.paginationToken),
        'idSeller': 11216,
        'state': null,
      };
    }
    this.orderService.getOrderList(params).subscribe((result: any) => {
      if (result) {
        this.resultModel = result.data;
        if (this.callOne) {
          this.length = this.resultModel.count;
          this.arrayPosition = [];
          this.arrayPosition.push('{}');
          this.callOne = false;
        }
        this.dataSource = new MatTableDataSource(this.resultModel.viewModel);
        if (this.arraySelect.length > 0 && this.dataSource.data.length > 0) {
          this.arraySelect.forEach(select => {
            this.dataSource.data.forEach(rowGen => {
              if (rowGen.id === select.id) {
                this.selection.select(rowGen);
              }
            });
          });
        }
        this.paginationToken = this.resultModel.paginationToken ? this.resultModel.paginationToken : '{}';
        this.loadingService.closeSpinner();
      } else {
        this.loadingService.closeSpinner();
      }
    });
  }


  paginations(event: any) {
    if (event.param.pageSize !== this.limit) {
      this.limit = event.param.pageSize;
      this.allClear();
    }
    if (event && event.param && event.param.pageIndex >= 0) {
      const index = event.param.pageIndex;
      if (index === 0) {
        this.paginationToken = '{}';
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
        this.paginationToken = '{}';
      }
      const params = {
        'limit': this.limit + '&paginationToken=' + encodeURI(this.paginationToken),
        'idSeller': 11216,
        'state': null,
      };
      this.getAllSeller(params);
    }
  }

  allClear() {
    this.paginationToken = '{}';
    this.arrayNotSelect = [];
    this.arrayPosition = [];
    this.getAllSeller(undefined);
  }

  toggleFilter() {
    this.stateSideNavOrder = !this.stateSideNavOrder;
  }

  filterListSummary(params: any) {
    params = {
      filterDate: params.filterDate,
      orderNumbers: params.orderNumbers,
      paginationToken: '{}',
      limit: this.limit,
      idSeller: this.idSeller,
    };
    console.log(params);
  }

  changeStatus(row: any, status: any ) {
    if (row) {
      if (status) {
        this.arraySelect.push(row);
      } else {
        const index = this.arraySelect.findIndex(rows => rows === row);
        this.arraySelect.splice(index, 1);
      }
    }
  }

}
