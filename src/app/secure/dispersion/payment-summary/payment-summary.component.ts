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
  public dataSource: MatTableDataSource<any>;
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
    this.filter = `?limit=${this.limit}&paginationToken=${encodeURI(this.paginationToken)}&NewLimit=${this.newLimit}&CurrentPage=${this.currentPage}`;
  }

  ngOnInit() {
    this.getRegexByModule();
    this.getAllPaymentSummary();
    this.createFormControls();

  }

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

  createFormControls() {
    this.filterPaymentSummary = this.fb.group({
      cutOffDate: new FormControl('', [Validators.pattern(this.paymentSummaryRegex.integerNumber)]),
      internalIdPayment: new FormControl('', [Validators.pattern(this.paymentSummaryRegex.integerNumber)]),
    });
  }

  getAllPaymentSummary() {
    this.loadingService.viewSpinner();
    this.dispersionService.getAllPaymentSummary(this.filter).subscribe((res: any) => {
      if (res && res.status === 200) {
        const { viewModel, count, paginationToken } = res.body;
        if (this.statusAllCheck === true) {
          viewModel.forEach(element => {
            element.excluded = true;
         });
        }
        this.dataSource = new MatTableDataSource(viewModel);
        if (this.onlyOne) {
          this.length = count;
          this.totalPayValue = res.body.extraInfo.TotalToPayPayoneer;
          this.totalSeller = res.body.extraInfo.TotalSellersToPayPayoneer;
        }
        this.onlyOne = false;
        this.loadingService.closeSpinner();
        this.savePaginationToken(paginationToken);
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

  savePaginationToken(pagination: string) {
    const isExist = this.arrayPosition.includes(pagination);
    if (isExist === false) {
      this.arrayPosition.push(pagination);
    }
  }

  paginations(event: any) {
    const newLimit = event.param.pageSize;
    const index = event.param.pageIndex;
    if (newLimit !== this.limit) {
      this.indexPage = 0;
      this.limit = event.param.pageSize;
      this.paginationToken = '{}';
      this.limit = 50;
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
    this.filter = `?limit=${this.limit}&paginationToken=${encodeURI(this.paginationToken)}&NewLimit=${this.newLimit}&CurrentPage=${this.currentPage}`;
    this.getAllPaymentSummary();
  }

  toggleFilterReportPaymentSummary() {
    this.sidenavSearchPaymentSummary.toggle();
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
    }
  }

  masterToggle(status: boolean, dataSource: any) {
    if (dataSource && dataSource.data) {
      const data = dataSource.data;
      data.forEach(element => {
        element.excluded = !status;
      });
      this.dataSource = new MatTableDataSource(data);
      this.statusAllCheck = !status;
    } else {
      this.selection.clear();
      this.arraySelect = [];
      this.statusAllCheck = !status;
    }
    console.log(this.statusAllCheck)
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


  changeStatusDispersionBySeller(payToSeller: any, status: any) {
    this.loadingService.viewSpinner();
    const params = [
      {
        sellerId: payToSeller.sellerId,
        cutOffDate: payToSeller.cutOffDate,
        excluded: status
      }
    ];

    this.dispersionService.excludeSellerPayoneer(params).subscribe((res: any) => {
      if (res) {
        this.loadingService.closeSpinner();
        const textStatus = status === true ? ' Excluido ' : ' Incluido ';
        // this.snackBar.open(this.languageService.instant('shared.update_successfully'), this.languageService.instant('actions.close'), {
        //   duration: 3000,
        // });
        this.snackBar.open('Vendedor' + textStatus + ' del pago de dispersion', this.languageService.instant('actions.close'), {
          duration: 3000,
        });
      } else {
        this.snackBar.open(this.languageService.instant('secure.orders.send.error_ocurred_processing'), this.languageService.instant('actions.close'), {
          duration: 3000,
        });
      }
    });
  }

  apllyFilterPaymentSummary(form: any) {
    if (form !== undefined) {
      const cutOffDate = form.cutOffDate ? `&cutOffDate=${moment(form.cutOffDate).format('YYYY/MM/DD')}` : '';
      const internalPaymentId = form.internalIdPayment ? `&internalPaymentId=${form.internalIdPayment}` : '';
      this.arrayPosition = [];
      this.arrayPosition.push('{}');
      this.filter = `?limit=${this.limit}&paginationToken=${encodeURI(this.paginationToken)}&NewLimit=${this.newLimit}&CurrentPage=${this.currentPage}` + cutOffDate  + internalPaymentId;
      this.getAllPaymentSummary();
    }
  }
  btnDispersion(){
    
  }

  clearForm() {
    this.onlyOne = true;
    this.filterPaymentSummary.reset();
    this.arrayPosition = [];
    this.paginationToken = '{}';
    this.currentPage = 0;
    this.arrayPosition.push('{}');
    this.filter = `?limit=${this.limit}&paginationToken=${encodeURI(this.paginationToken)}&NewLimit=${this.newLimit}&CurrentPage=${this.currentPage}`;
    this.getAllPaymentSummary();
    this.toggleFilterReportPaymentSummary();
  }

}
