import { Component, OnInit, ViewChild } from '@angular/core';
import { SearchFormEntity, InformationToForm } from '@app/shared';
import { MatSidenav, MatTableDataSource } from '@angular/material';
import { LoadingService } from '@app/core';
import { MyProfileService } from '@app/secure/aws-cognito/profile/myprofile.service';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { BillingService } from '../billing.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import moment from 'moment';


@Component({
  selector: 'app-summary-payments',
  templateUrl: './summary-payments.component.html',
  styleUrls: ['./summary-payments.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('void', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('*', style({ height: '*', visibility: 'visible' })),
      transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
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
  public summaryTotal = 0;
  public totalPay = 0;
  public totalDiscount = 0;
  public callOne = true;
  public arrayPosition = [];
  public paginationToken = '{}';
  public typeSeller = '';

  public displayedColumns = [
    'check',
    'number_bill',
    'quantity_orders',
    'credit_note',
    'devolutions',
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
  public idSeller = '';
  public disabledButton = false;
  public dateFilter = moment().format('YYYY/MM/DD');


  constructor(
    private billingService: BillingService,
    private router: Router,
    public loadingService: LoadingService,
    private profileService: MyProfileService,
  ) { }

  ngOnInit() {
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
      const paramsArray = {
        filterDate: this.dateFilter,
        paginationToken: '{}',
        limit: this.limit,
        newLimit: null,
        currentPage: null,
        idSeller: sellerData.IdSeller
      };
      this.idSeller = sellerData.IdSeller;
      this.getAllSeller(paramsArray);
    }
  }

  /**
   * Metodo para retornar el primer pedido de nota credito
   * @param {*} param
   * @returns
   * @memberof SummaryPaymentsComponent
   */
  returnFirstPosition(param: any) {
    if (param) {
      const splitArr = param.split(',');
      if (splitArr.length > 1) {
        return splitArr[0] + ' [+]'
      } else {
        return splitArr[0]
      }
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
    let query = {};
    this.summaryTotal = 0;
    this.totalPay = 0;
    this.totalDiscount = 0;
    if (params !== undefined) {
      query = {
        filterDate: params.filterDate,
        paginationToken: params.paginationToken,
        limit: this.limit,
        newLimit: null,
        currentPage: null,
        SellerId: params.idSeller
      };
    } else {
      query = {
        filterDate: this.dateFilter,
        paginationToken: '{}',
        limit: this.limit,
        newLimit: null,
        currentPage: null,
        SellerId: this.idSeller
      };
    }
    this.billingService.getAllSummaryPayment(query).subscribe((result: any) => {
      if (result) {
        this.resultModel = result.data;
        if (this.callOne) {
          this.length = this.resultModel.count;
          this.arrayPosition = [];
          this.arrayPosition.push('{}');
          this.callOne = false;
        }
        this.dataSource = new MatTableDataSource(this.resultModel.viewModel);
        if (this.dataSource && this.dataSource.data && this.dataSource.data.length > 0) {
          this.dataSource.data.forEach(element => {
            this.totalPay = this.totalPay + element.billingTotalObject;
            this.totalDiscount = this.totalDiscount + element.discountedTotalObject;
            this.typeSeller = element.sellerType;
          });
          this.summaryTotal = this.totalPay - this.totalDiscount;
        }
        if (this.arraySelect.length > 0 && this.dataSource.data.length > 0) {
          this.arraySelect.forEach(select => {
            this.dataSource.data.forEach(rowGen => {
              if (rowGen.billingNumber === select.billingNumber) {
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

  /**
   * funcion para capturar el evento cuando se pasa de pagina
   *
   * @param {*} event
   * @memberof SummaryPaymentsComponent
   */
  paginations(event: any) {
    if (event.param.pageSize !== this.limit) {
      this.limit = event.param.pageSize;
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
        filterDate: this.dateFilter,
        paginationToken: this.paginationToken,
        limit: this.limit,
        newLimit: null,
        currentPage: null,
        idSeller: this.idSeller
      };
      this.getAllSeller(params);
    }
  }
  /**
   * funcion para limpiar la lista
   *
   * @memberof SummaryPaymentsComponent
   */
  allClear() {
    this.paginationToken = '{}';
    this.arrayNotSelect = [];
    this.arrayPosition = [];
    this.getAllSeller();
  }
  /**
   * funcion para mostrar el toggle filter
   *
   * @memberof SummaryPaymentsComponent
   */
  toggleFilter() {
    this.stateSideNavOrder = !this.stateSideNavOrder;
  }
  /**
   *  funcion filtrar el listado
   *
   * @param {*} params
   * @memberof SummaryPaymentsComponent
   */
  filterListSummary(params: any) {
    this.dateFilter = params.filterDate;
    this.callOne = true;
    params = {
      filterDate: this.dateFilter,
      paginationToken: '{}',
      limit: this.limit,
      idSeller: this.idSeller,
    };
    this.getAllSeller(params);
    this.loadingService.viewSpinner();
  }

  updateToggle(params: any) {
    this.stateSideNavOrder = params.close;
  }
  /**
   * funcion para cambiar status de los checkBox
   *
   * @param {*} row
   * @param {*} status
   * @memberof SummaryPaymentsComponent
   */
  changeStatus(row: any, status: any) {
    if (row) {
      if (status) {
        this.arraySelect.push(row);
      } else {
        const index = this.arraySelect.findIndex(rows => rows === row);
        this.arraySelect.splice(index, 1);
      }
    }
  }
  /**
   * funcion para enviar el numero de pagos ha detalles de pagos
   *
   * @memberof SummaryPaymentsComponent
   */
  sendDetailSummary() {
    const listBilling = [];
    this.arraySelect.forEach(element => {
      listBilling.push(element.billingNumber);
    });
    this.router.navigate(['securehome/seller-center/billing/detalle-pagos', { listBilling: listBilling.toString() }]);
  }
}
