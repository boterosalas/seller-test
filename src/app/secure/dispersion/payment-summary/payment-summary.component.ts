import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher, MatSidenav, MatSnackBar, MatTableDataSource } from '@angular/material';
import { InformationToForm, SearchFormEntity } from '@app/shared';
import { TranslateService } from '@ngx-translate/core';
import { DispersionService } from '../dispersion.service';
import * as _moment from 'moment';
import { LoadingService } from '@app/core';
import { SupportService } from '@app/secure/support-modal/support.service';

const moment = _moment;

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-payment-summary',
  templateUrl: './payment-summary.component.html',
  styleUrls: ['./payment-summary.component.scss']
})
export class PaymentSummaryComponent implements OnInit {

  public selection = new SelectionModel<any>(true, []);
  public filter: any;
  public limit = 50;
  public paginationToken = '{}';
  public newLimit = null;
  public currentPage = 0;
  public length = 0;
  public dataSource: any;
  public onlyOne = true;
  public isAllSelectedCurrent = false;
  public statusAllCheck = false;
  public arrayNotSelect = [];
  public arraySelect = [];
  public all = false;
  public disabledBtn = false;
  public arrayPosition = [];
  public stateSideNavOrder = false;
  public paymentSummaryRegex = { integerNumber: '' };

  public indexPage = 0;
  public totalSeller = 0;
  public totalPayValue = 0;
  public filterPaymentSummary: FormGroup;
  public allPaymentSummary = [];
  public showTable = false;

  public totalCountAux = 0;
  public totaSellerAux = 0;


  @ViewChild('sidenavSearchPaymentSummary') sidenavSearchPaymentSummary: MatSidenav;
  @ViewChild('toolbarOptions') toolbarOption;

  public informationToForm: SearchFormEntity = {
    title: 'module.Dispersion',
    subtitle: 'menu.Resumen de pagos',
    btn_title: 'dispersión',
    title_for_search: 'Filtros',
    type_form: 'module',
    information: new InformationToForm,
    count: null
  };

  public displayedColumns = [
    'check',
    'cutoffDate',
    'idSeller',
    'seller',
    'quantityOrders',
    'idInternalCode',
    'description',
    'totalToPay'
  ];

  public btnFilter = true;


  constructor(
    private dispersionService: DispersionService,
    private snackBar: MatSnackBar,
    private languageService: TranslateService,
    public SUPPORT: SupportService,
    private loadingService: LoadingService,
    private fb: FormBuilder,
  ) {
    this.arrayPosition = [];
    this.arrayPosition.push('{}');
    this.filter = `?limit=${this.limit}&paid=false&paginationToken=${encodeURI(this.paginationToken)}&NewLimit=${this.newLimit}&CurrentPage=${this.currentPage}`;
  }

  ngOnInit() {
    this.getRegexByModule();
    this.getAllPaymentSummary();
    this.createFormControls();

  }
  /**
   * funcion para consultar la regex de la base de datos
   *
   * @memberof PaymentSummaryComponent
   */
  public getRegexByModule(): void {
    this.SUPPORT.getRegexFormSupport(null).subscribe(res => {
      let dataCommissionRegex = JSON.parse(res.body.body);
      dataCommissionRegex = dataCommissionRegex.Data.filter(data => data.Module === 'vendedores');
      for (const val in this.paymentSummaryRegex) {
        if (!!val) {
          const element = dataCommissionRegex.find(regex => regex.Identifier === val.toString());
          this.paymentSummaryRegex[val] = element && `${element.Value}`;
        }
      }
      this.createFormControls();
    });
  }
  /**
   * funcion para crear formulario
   *
   * @memberof PaymentSummaryComponent
   */
  createFormControls() {
    this.filterPaymentSummary = this.fb.group({
      cutOffDate: new FormControl(),
      internalIdPayment: new FormControl('', [Validators.pattern(this.paymentSummaryRegex.integerNumber)]),
      sellerId: new FormControl('', [Validators.pattern(this.paymentSummaryRegex.integerNumber)]),
      amount: new FormControl('', [Validators.pattern(this.paymentSummaryRegex.integerNumber)]),
    });
  }
  /**
   * funcion para consultar todos los vendedores para la dispersion
   *
   * @memberof PaymentSummaryComponent
   */
  getAllPaymentSummary() {
    this.loadingService.viewSpinner();
    this.dispersionService.getAllPaymentSummary(this.filter).subscribe((res: any) => {
      if (res && res.status === 200) {
        const { viewModel, count, paginationToken } = res.body;
        if (this.statusAllCheck === true) {
          viewModel.forEach(element => {
            element.excluded = false;
          });
        }
        this.allPaymentSummary = viewModel;
        this.dataSource = new MatTableDataSource(this.allPaymentSummary);
        if (this.onlyOne) {
          this.length = count;
        }
        this.totalCountAux = res.body.extraInfo.TotalToPayPayoneer;
        this.totaSellerAux = res.body.extraInfo.TotalSellersToPayPayoneer;
        this.totalPayValue = res.body.extraInfo.TotalToPayPayoneer !== '0' ? parseFloat(res.body.extraInfo.TotalToPayPayoneer) : 0;
        this.totalSeller = res.body.extraInfo.TotalSellersToPayPayoneer !== '0' ? parseInt(res.body.extraInfo.TotalSellersToPayPayoneer) : 0;
        this.onlyOne = false;
        this.loadingService.closeSpinner();
        this.savePaginationToken(paginationToken);
        this.showTable = true;
      } else {
        this.loadingService.closeSpinner();
        this.snackBar.open(this.languageService.instant('public.auth.forgot.error_try_again'), this.languageService.instant('actions.close'), {
          duration: 3000,
        });
      }
    }, error => {
      this.loadingService.closeSpinner();
      this.snackBar.open(this.languageService.instant('public.auth.forgot.error_try_again'), this.languageService.instant('actions.close'), {
        duration: 3000,
      });
    });
  }
  /**
   * funcion para salvar el pagination token 
   *
   * @param {string} pagination
   * @memberof PaymentSummaryComponent
   */
  savePaginationToken(pagination: string) {
    const isExist = this.arrayPosition.includes(pagination);
    if (isExist === false) {
      this.arrayPosition.push(pagination);
    }
  }
  /**
   * funcion para escuchar el cambio de pagina y el limite
   *
   * @param {*} event
   * @memberof PaymentSummaryComponent
   */
  paginations(event: any) {
    const newLimit = event.param.pageSize;
    const index = event.param.pageIndex;
    if (newLimit !== this.limit) {
      this.indexPage = 0;
      this.limit = event.param.pageSize;
      this.paginationToken = '{}';
      this.limit = newLimit;
      this.currentPage = 0;
      const paginator = this.toolbarOption.getPaginator();
      paginator.pageIndex = 0;
      this.arrayPosition = [];
      this.arrayPosition.push('{}');
    } else {
      let newPaginationToken = this.arrayPosition[index];
      if (newPaginationToken === undefined) {
        newPaginationToken = '{}';
      }
      this.paginationToken = newPaginationToken;
    }
    this.filter = `?limit=${this.limit}&paid=false&paginationToken=${encodeURI(this.paginationToken)}&NewLimit=${this.newLimit}&CurrentPage=${this.currentPage}`;
    this.getAllPaymentSummary();
  }
  /**
   * funcion para mostrar el toggle para mostrar el filtro
   *
   * @memberof PaymentSummaryComponent
   */
  toggleFilterReportPaymentSummary() {
    this.sidenavSearchPaymentSummary.toggle();
  }
  /**
   * funcion para seleccionar todo los registros
   *
   * @memberof PaymentSummaryComponent
   */
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
    }
  }
  /**
   * funcion para cambiar el status check all
   *
   * @param {boolean} status
   * @param {*} dataSource
   * @memberof PaymentSummaryComponent
   */
  masterToggle(status: boolean, dataSource: any) {
    if (dataSource && dataSource.data) {
      const data = dataSource.data;
      data.forEach(element => {
        element.excluded = status;
      });
      this.dataSource = new MatTableDataSource(data);
      this.statusAllCheck = !status;
      const params = [
        {
          sellerId: null,
          cutOffDate: null,
          excluded: null,
          ExcludeAll: status
        }
      ];
      this.dispersionService.excludeSellerPayoneer(params).subscribe((res: any) => {
        if (res) {
          this.loadingService.closeSpinner();
          const textStatus = !status === true ? ' incluido  ' : ' excluido ';
          if (!status === true) {
            this.getAllPaymentSummary();
          } else {
            this.totalPayValue = 0;
            this.totalSeller = 0;
          }
          this.snackBar.open('Todos los vendedores fueron' + textStatus + ' en el pago de dispersión', this.languageService.instant('actions.close'), {
            duration: 3000,
          });
          if (status) {
            this.totalPayValue = 0;
            this.totalSeller = 0;
          } else {
            this.totalPayValue = this.totalCountAux;
            this.totalSeller = this.totaSellerAux;
          }
        }
      });
    } else {
      this.selection.clear();
      this.arraySelect = [];
      this.statusAllCheck = !status;
    }
  }
  /**
   * funcion para cambiar el status individualmente 
   *
   * @param {*} row
   * @param {*} status
   * @memberof PaymentSummaryComponent
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

    this.isAllSelected();
  }

  /**
   * funcion consumir el serivio para cambiar el status en la base de datos
   *
   * @param {*} payToSeller
   * @param {*} status
   * @memberof PaymentSummaryComponent
   */
  changeStatusDispersionBySeller(payToSeller: any, status: any) {
    this.loadingService.viewSpinner();
    const params = [
      {
        sellerId: payToSeller.sellerId,
        cutOffDate: payToSeller.cutOffDate,
        excluded: status,
        ExcludeAll: null
      }
    ];

    this.dispersionService.excludeSellerPayoneer(params).subscribe((res: any) => {
      if (res) {
        this.loadingService.closeSpinner();
        const textStatus = status === true ? ' Excluido ' : ' Incluido ';
        this.dataSource.data.forEach(element => {
          if (element.internalPaymentId === payToSeller.internalPaymentId) {
            element.excluded = status;
          }
        });
        this.snackBar.open('Vendedor' + textStatus + ' del pago de dispersión', this.languageService.instant('actions.close'), {
          duration: 3000,
        });
        this.recalculate(payToSeller.amount, status);
      } else {
        this.snackBar.open(this.languageService.instant('secure.orders.send.error_ocurred_processing'), this.languageService.instant('actions.close'), {
          duration: 3000,
        });
      }
    });
  }
  /**
   * funcion para recalcular el total a pagar y el numero de vendedores
   *
   * @param {number} valueToPay
   * @param {boolean} status
   * @memberof PaymentSummaryComponent
   */
  recalculate(valueToPay: number, status: boolean) {
    if (status) {
      this.totalPayValue = this.totalPayValue - valueToPay;
      this.totalSeller--;
    } else {
      this.totalPayValue = this.totalPayValue + valueToPay;
      this.totalSeller++;
    }
  }
  /**
   * funcion para aplicar filtros
   *
   * @param {*} form
   * @memberof PaymentSummaryComponent
   */
  apllyFilterPaymentSummary(form: any) {
    if (form !== undefined) {
      const cutOffDate = form.cutOffDate ? `&cutOffDate=${moment(form.cutOffDate).format('DD/MM/YYYY')}` : '';
      const internalPaymentId = form.internalIdPayment ? `&internalPaymentId=${form.internalIdPayment}` : '';
      const sellerId = form.sellerId ? `&idSeller=${form.sellerId}` : '';
      const amount = form.amount ? `&amountValue=${form.amount}` : '';
      this.arrayPosition = [];
      this.arrayPosition.push('{}');
      this.onlyOne = true;
      this.filter = `?limit=${this.limit}&paid=false&paginationToken=${encodeURI(this.paginationToken)}&NewLimit=${this.newLimit}&CurrentPage=${this.currentPage}` + cutOffDate + internalPaymentId + sellerId + amount;
      this.toggleFilterReportPaymentSummary();
      this.dataSource = [];
      this.getAllPaymentSummary();
    }
  }
  /**
   * funcion para disparar el evento de dispersar 
   *
   * @memberof PaymentSummaryComponent
   */
  btnDispersion() {
    this.loadingService.viewSpinner();
    this.dispersionService.sendDispersion(null).subscribe((res: any) => {
      if (res) {
        this.loadingService.closeSpinner();
        this.snackBar.open(res.message, this.languageService.instant('actions.close'), {
          duration: 3000,
        });
        this.getAllPaymentSummary();
      } else {
        this.snackBar.open(this.languageService.instant('secure.orders.send.error_ocurred_processing'), this.languageService.instant('actions.close'), {
          duration: 3000,
        });
      }
    }, error => {
      this.snackBar.open(this.languageService.instant('secure.orders.send.error_ocurred_processing' + error), this.languageService.instant('actions.close'), {
        duration: 3000,
      });
    });
  }
  /**
   * funcion para limpiar el formulario del filtro
   *
   * @memberof PaymentSummaryComponent
   */
  clearForm() {
    this.onlyOne = true;
    this.filterPaymentSummary.reset();
    this.arrayPosition = [];
    this.allPaymentSummary = [];
    this.paginationToken = '{}';
    this.currentPage = 0;
    this.showTable = false;
    this.arrayPosition.push('{}');
    this.filter = `?limit=${this.limit}&paid=false&paginationToken=${encodeURI(this.paginationToken)}&NewLimit=${this.newLimit}&CurrentPage=${this.currentPage}`;
    this.getAllPaymentSummary();
    this.toggleFilterReportPaymentSummary();
  }
}
