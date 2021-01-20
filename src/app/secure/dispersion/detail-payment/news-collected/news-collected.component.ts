import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSidenav, MatSnackBar, MatTableDataSource } from '@angular/material';
import { LoadingService } from '@app/core';
import { SupportService } from '@app/secure/support-modal/support.service';
import { InformationToForm, SearchFormEntity } from '@app/shared';
import { TranslateService } from '@ngx-translate/core';
import { DetailPaymentService } from '../detail-payment.service';

@Component({
  selector: 'app-news-collected',
  templateUrl: './news-collected.component.html',
  styleUrls: ['./news-collected.component.scss']
})
export class NewsCollectedComponent implements OnInit {

  public displayedColumns = [
    'datePay',
    'idPayonner',
    'internalPaymentId',
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
  public limit = 50;
  public paginationToken = '{}';
  public filterNewsCollected: FormGroup;
  public indexPage = 0;
  public currentPage = 0;
  public stateSideNavOrder = false;

  regexFilter = {
    orderNumber: ''
  };

  _sellerData;

  // Set para escuchar cada vez que tenga cambio el padre.
  @Input() set sellerData(value: any) {
    if (value) {
      this.onlyOne = true;
      this._sellerData = value;
      this.getAllNewsCollected();
    }
  };

  @ViewChild('sidenavNewsCollected') sidenavNewsCollected: MatSidenav;
  @ViewChild('toolbarOptions') toolbarOption;

   // Evento que comunica al padre cuando tiene filtros.
   @Output() _newsCollectedFilterEmit = new EventEmitter<any>();

  public informationToForm: SearchFormEntity = {
    title: 'module.Dispersion',
    subtitle: 'menu.Resumen de pagos',
    btn_title: 'dispersión',
    title_for_search: 'Filtro novedades de pagos',
    type_form: 'module',
    information: new InformationToForm,
    count: null
  };

  urlParams: string;

  constructor(
    private snackBar: MatSnackBar,
    private languageService: TranslateService,
    private loadingService: LoadingService,
    public SUPPORT: SupportService,
    private fb: FormBuilder,
    private detailPaymentService: DetailPaymentService
  ) { }

  ngOnInit() {
    this.validateFormSupport();
    this.getAllNewsCollected();
  }

  /**
   * Metodo para crear el formulario del filtro 
   * @memberof NewsCollectedComponent
   */
  createFormControls() {
    this.filterNewsCollected = this.fb.group({
      cutOffDate: new FormControl(''),
      dispersionDate: new FormControl(''),
      internalIdPayment: new FormControl('', [Validators.pattern(this.regexFilter.orderNumber)]),
      orderNumber: new FormControl('', [Validators.pattern(this.regexFilter.orderNumber)])
    });
  }

  /**
   * Metodo para traer reges de la base de datos
   * @memberof NewsCollectedComponent
   */
  public validateFormSupport(): void {
    this.SUPPORT.getRegexFormSupport(null).subscribe(res => {
      let dataOffertRegex = JSON.parse(res.body.body);
      dataOffertRegex = dataOffertRegex.Data.filter(data => data.Module === 'reclamaciones');
      for (const val in this.regexFilter) {
        if (!!val) {
          const element = dataOffertRegex.find(regex => regex.Identifier === val.toString());
          this.regexFilter[val] = element && `${element.Value}`;
        }
      }
      this.createFormControls();
    });
  }

  /**
   * Función para abrir el toogle del filtro
   * @memberof NewsCollectedComponent
   */
  toggleFilterNewsCollected() {
    this.sidenavNewsCollected.toggle();
  }

  /**
   * Metodo para ir guardando el paginationToken y manejar paginado
   * @param {*} event
   * @memberof NewsCollectedComponent
   */
  paginations(event: any) {
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
    this.getAllNewsCollected(this.urlParams, null);
  }

  /**
   * Metodo para validar el formato de la fecha yyyy-mm-dd
   * @param {*} date
   * @returns {*}
   * @memberof NewsCollectedComponent
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
   * @memberof NewsCollectedComponent
   */
  public addsZeroDate(param: any): any {
    if (param.length < 2) {
      return '0' + param;
    }
    return param;
  }

  /**
   * Funcion para traer el listado de las novedades de pagos
   * @memberof NewsCollectedComponent
   */
  getAllNewsCollected(applyPagination?: any, paramsFilter?: any) {
    let url;
    let urlFilters;
    this.loadingService.viewSpinner();

    if (applyPagination || paramsFilter) {
      url = paramsFilter ? `?limit=${this.limit}&paginationToken=${encodeURI(this.paginationToken)}` : this.urlParams;
      if (paramsFilter) {
        urlFilters = {
          SellerId: this._sellerData.IdSeller.toString(),
          PaymentNew: {
            CutOffDate: paramsFilter.cutOffDate,
            DispersionDate: paramsFilter.dispersionDate,
            InternalPaymentId: parseFloat(paramsFilter.internalIdPayment),
            OrderNumber: paramsFilter.orderNumber
          }
        };
      } else {
        urlFilters = {
          SellerId: this._sellerData.IdSeller.toString(),
          PaymentNew: {}
        };
      }
    } else {
      url = `?limit=${this.limit}&paginationToken=${encodeURI(this.paginationToken)}`;
      urlFilters = {
        SellerId: this._sellerData.IdSeller.toString(),
        PaymentNew: {}
      };
    }
    this._newsCollectedFilterEmit.emit(urlFilters.PaymentNew);
    this.detailPaymentService.getAllNewsCollected(url, urlFilters).subscribe((res: any) => {
      if (res && res.status === 200) {
        const { viewModel, count, paginationToken } = res.body;
        this.dataSource = new MatTableDataSource(viewModel);
        if (this.onlyOne) {
          this.length = count;
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

  /**
   * Funcion para guardar el paginationtoken
   * @param {string} pagination
   * @memberof NewsCollectedComponent
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
   * @memberof NewsCollectedComponent
   */
  apllyFilterNewsCollected(params: any) {
    if (params && params.cutOffDate) {
      params.cutOffDate = params.cutOffDate;
    }
    if (params && params.dispersionDate) {
      params.dispersionDate = params.dispersionDate;
    }
    this.getAllNewsCollected(null, params);
    this.toggleFilterNewsCollected();
    this.onlyOne = true;
  }

  /**
   * Boton limpiar formulario, refresca data sin filtros
   * @memberof NewsCollectedComponent
   */
  clearForm() {
    this.onlyOne = true;
    this.filterNewsCollected.reset();
    this.arrayPosition = [];
    this.paginationToken = '{}';
    this.currentPage = 0;
    this.arrayPosition.push('{}');
    this.getAllNewsCollected();
  }

}
