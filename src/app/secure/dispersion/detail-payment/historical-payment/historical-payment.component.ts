import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSidenav, MatSnackBar, MatTableDataSource } from '@angular/material';
import { LoadingService } from '@app/core';
import { SupportService } from '@app/secure/support-modal/support.service';
import { InformationToForm, SearchFormEntity } from '@app/shared';
import { TranslateService } from '@ngx-translate/core';
import { DetailPaymentService } from '../detail-payment.service';

@Component({
  selector: 'app-historical-payment',
  templateUrl: './historical-payment.component.html',
  styleUrls: ['./historical-payment.component.scss']
})
export class HistoricalPaymentComponent implements OnInit {

  @Input() sellerData: any;

  public displayedColumns = [
    'datePay',
    'idPayonner',
    'order',
    'seller',
    'description',
    'sale',
    'comission',
    'totalToPay',
  ];

  public arrayPosition = [];
  public dataSource: MatTableDataSource<any>;


  public onlyOne = true;
  public length = 0;
  // public limit = 50;
  public limit = 2;
  public paginationToken = '{}';
  public filterHistoricalPayment: FormGroup;
  public btnFilter = false;
  public indexPage = 0;
  public currentPage = 0;
  public stateSideNavOrder = false;


  @ViewChild('sidenavHistoricalPayment') sidenavHistoricalPayment: MatSidenav;
  @ViewChild('toolbarOptions') toolbarOption;
  urlParams: string;

  public informationToForm: SearchFormEntity = {
    title: 'module.Dispersion',
    subtitle: 'menu.Resumen de pagos',
    btn_title: 'dispersión',
    title_for_search: 'Filtro histórico de pagos',
    type_form: 'module',
    information: new InformationToForm,
    count: null
  };

  constructor(
    private snackBar: MatSnackBar,
    private languageService: TranslateService,
    private loadingService: LoadingService,
    public SUPPORT: SupportService,
    private fb: FormBuilder,
    private detailPaymentService: DetailPaymentService
  ) { }

  ngOnInit() {
    console.log(1, this.sellerData);
    this.createFormControls();
    this.getAllListHiistoric();
  }

  /**
   * Metodo para crear el formulario del filtro 
   * @memberof HistoricalPaymentComponent
   */
  createFormControls() {
    this.filterHistoricalPayment = this.fb.group({
      cutOffDate: new FormControl(''),
      dispersionDate: new FormControl(''),
      internalIdPayment: new FormControl(''),
      orderNumber: new FormControl('')
    });
  }

  /**
   * Función para abrir el toogle del filtro
   * @memberof HistoricalPaymentComponent
   */
  toggleFilterHistoricalPayment() {
    this.sidenavHistoricalPayment.toggle();
  }

  /**
   * Metodo para ir guardando el paginationToken y manejar paginado
   * @param {*} event
   * @memberof HistoricalPaymentComponent
   */
  paginations(event: any) {
    console.log(event);
    const newLimit = event.param.pageSize;
    const index = event.param.pageIndex - 1;
    if (newLimit !== this.limit) {
      this.indexPage = 0;
      this.limit = event.param.pageSize;
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
    this.urlParams = `?limit=${this.limit}&paginationToken=${encodeURI(this.paginationToken)}`;
    this.getAllListHiistoric(this.urlParams, null);
  }

  /**
   * Metodo para validar el formato de la fecha dd-mm-yyyy
   * @param {*} date
   * @returns {*}
   * @memberof HistoricalPaymentComponent
   */
  public getDate(date: any): any {
    const day = this.addsZeroDate(date.getDate().toString());
    const months = this.addsZeroDate((date.getMonth() + 1).toString());
    const year = date.getFullYear();
    return year + '-' + months + '-' + day;
  }

  /**
   * Funcion para agregar 0 a la fecha si lo necesita
   * @param {*} param
   * @returns {*}
   * @memberof HistoricalPaymentComponent
   */
  public addsZeroDate(param: any): any {
    if (param.length < 2) {
      return '0' + param;
    }
    return param;
  }

  /**
   * Funcion para traer el listado del historico de pagos
   * @memberof HistoricalPaymentComponent
   */
  getAllListHiistoric(applyPagination?: any, paramsFilter?: any) {
    let url;
    let urlFilters;
    this.loadingService.viewSpinner();
    console.log(1, applyPagination);
    if (applyPagination || paramsFilter) {
      url = paramsFilter ? `?limit=${this.limit}&paginationToken=${encodeURI(this.paginationToken)}` : this.urlParams;
      if (paramsFilter) {
        urlFilters = {
          SellerId: this.sellerData.IdSeller.toString(),
          DispersionFilter: {
            CutOffDate: paramsFilter.cutOffDate,
            DispersionDate: paramsFilter.dispersionDate,
            InternalPaymentId: paramsFilter.internalIdPayment,
            OrderNumber: paramsFilter.orderNumber
          }
        };
       } else {
          urlFilters = {
            SellerId: this.sellerData.IdSeller.toString(),
            DispersionFilter: {}
          };
        }
      } else {
        url = `?limit=${this.limit}&paginationToken=${encodeURI(this.paginationToken)}`;
        urlFilters = {
          SellerId: this.sellerData.IdSeller.toString(),
          DispersionFilter: {}
        };
      }
      this.detailPaymentService.getAllDetailPayment(url, urlFilters).subscribe((res: any) => {
        if (res && res.status === 200) {
          const { viewModel, count, paginationToken } = res.body;
          // console.log(this.statusAllCheck);
          this.dataSource = new MatTableDataSource(viewModel);
          if (this.onlyOne) {
            this.length = count;
          }
          this.onlyOne = false;
          this.loadingService.closeSpinner();
          console.log(33, paginationToken);
          this.savePaginationToken(paginationToken);
          this.stateSideNavOrder = false;
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
     * Funcion para guardar el paginationtoken
     * @param {string} pagination
     * @memberof HistoricalPaymentComponent
     */
    savePaginationToken(pagination: string) {
      const isExist = this.arrayPosition.includes(pagination);
      if (isExist === false) {
        this.arrayPosition.push(pagination);
      }
    }

    /**
     * Metodo para aplicar filtros
     * @param {*} params
     * @memberof HistoricalPaymentComponent
     */
    apllyFilterHistoricalPayment(params: any) {
      if (params && params.cutOffDate) {
        params.cutOffDate = this.getDate(new Date(params.cutOffDate));
      }
      if (params && params.dispersionDate) {
        params.dispersionDate = this.getDate(new Date(params.dispersionDate));
      }
      this.getAllListHiistoric(null, params);
      this.toggleFilterHistoricalPayment();
      this.onlyOne = true;
    }

    /**
     * Boton limpiar formulario, refresca data sin filtros
     * @memberof HistoricalPaymentComponent
     */
    clearForm() {
      this.onlyOne = true;
      this.filterHistoricalPayment.reset();
      this.arrayPosition = [];
      this.paginationToken = '{}';
      this.currentPage = 0;
      this.arrayPosition.push('{}');
      this.getAllListHiistoric();
    }

  }
