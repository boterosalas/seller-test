import { Component, OnInit, ViewChild } from '@angular/core';
import { SearchFormEntity, InformationToForm } from '@app/shared';
import { MatSidenav, MatTableDataSource } from '@angular/material';
import { OrderService } from '@app/secure/orders/orders-list/orders.service';
import { LoadingService } from '@app/core';

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
    btn_title: 'secure.orders.filter.title',
    title_for_search: 'secure.orders.filter.title',
    type_form: 'summaryPayment',
    information: new InformationToForm,
    count: null
  };
  public pageSize = 10;
  public querySearch = '';


  constructor(
    private orderService: OrderService,
    public loadingService: LoadingService,
  ) { }

  ngOnInit() {
    const paramsArray = {
      'limit': this.pageSize + '&paginationToken=' + encodeURI('{}'),
      'idSeller': 11216,
      'state': null,
      'callOne': true
    };
    this.getAllSeller(paramsArray);
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

}
