import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { StoreModel } from '@app/secure/offers/stores/models/store.model';
import { EventEmitterSeller } from '@app/shared/events/eventEmitter-seller.service';
import { SearchFormEntity, InformationToForm } from '@app/shared';
import { ShellComponent } from '@app/core/shell';
import { LoadingService } from '@app/core';
import { MatTableDataSource, MatSidenav, ErrorStateMatcher, MatSnackBar } from '@angular/material';
import { animate, style, transition, state, trigger } from '@angular/animations';
import { CalificationService } from '../quality.service';
import { SupportService } from '@app/secure/support-modal/support.service';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-calification-list',
  templateUrl: './calification-list.component.html',
  styleUrls: ['./calification-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('void', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('*', style({ height: '*', visibility: 'visible' })),
      transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})


export class CalificationListComponent implements OnInit {

  numberElements = 0;
  public informationToForm: SearchFormEntity = {
    title: 'module.Calidad',
    subtitle: 'menu.Calificación de Vendedores',
    btn_title: 'secure.quality.quality-score.filter-title',
    title_for_search: 'secure.quality.quality-score.filter-title',
    type_form: 'orders',
    information: new InformationToForm,
    count: this.numberElements.toString()
  };
  typeProfile = 1;
  public idSeller: any;
  public nameSeller: string;
  public subFilterOrder: any;
  public displayedColumns = [
    'qualityScore',
    'qualityMonth',
    'qualityIssued',
    'actions'
  ];

  public monthEN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  public monthES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  public dateInitQualityMonth = '';
  public dateFinalQualityMonth = '';
  public dateInitQualityIssued = '';
  public dateFinalQualityIssued = '';

  public paginationToken = '{}';
  public arrayPosition = [];
  public params: any;
  public isClear = false;

  public pageSize = 50;
  public querySearch = '';
  public onlyOne = true;
  public dataSource: MatTableDataSource<any>;
  public length = 0;
  public showEmpty = true;

  public lastState: null;
  public pageIndexChange: 0;

  public stateSideNavOrder = false;

  private searchSubscription: any;

  public showContainerDetail = false;
  public detailByElemet: any;

  public calificationsParams: any;
  public sortedData: any;

  public penaltyOutSideDelivery = 0;
  public penaltyCanceledBySeller = 0;
  public penaltyTotal = 0;

  public colorCalificationPromiseDelivery = 'default';
  public colorCalificationCase = 'default';
  public colorCalificationCanceled = 'default';

  public setFormatDateInfoSellerMonthQuality = '';
  public setFormatDateInfoSellerGenrateDate = '';
  public showSelectorMouthQuality= true;
  public showSelectorMouthEmit=  true;
  public textSelector = 'Seleccione el filtro para realizar la consulta, el formato de fecha es (MM/AAAA).';

  public filterCalifications: FormGroup;
  public matcher: MyErrorStateMatcher;
  BrandsRegex = { dateMonthYear: '' };
  public selectFilter: any;
  @ViewChild('rdCalification' , {static: false}) rdCalification: any;
  @ViewChild('rdEmit', {static: false}) rdEmit: any;

  @ViewChild('sidenavSearchOrder', {static: false}) sidenavSearchOrder: MatSidenav;

  constructor(
    private shellComponent: ShellComponent,
    private loadingService: LoadingService,
    private calificationService: CalificationService,
    public eventsSeller: EventEmitterSeller,
    private fb: FormBuilder,
    private languageService: TranslateService,
    public SUPPORT?: SupportService,
    public snackBar?: MatSnackBar,
  ) {
  }

  ngOnInit() {
    this.eventEmitSearch();
    this.createFormControls();
    this.validateFormSupport();
  }
  /**
   * Funcion para inicializar el formulario para el filtro
   *
   * @memberof CalificationListComponent
   */
  createFormControls() {
    this.filterCalifications = new FormGroup({
      dateInitQualityMonth: new FormControl('', [Validators.pattern(this.BrandsRegex.dateMonthYear)]),
      dateFinalQualityMonth: new FormControl('', [Validators.pattern(this.BrandsRegex.dateMonthYear)]),
      dateInitQualityIssued: new FormControl('', [Validators.pattern(this.BrandsRegex.dateMonthYear)]),
      dateFinalQualityIssued: new FormControl('', [Validators.pattern(this.BrandsRegex.dateMonthYear)]),
    });
  }

  /**
   * funcion para validar la regex de base de datos y comparar con los campos de fechas
   *
   * @memberof CalificationListComponent
   */
  public validateFormSupport(): void {
    this.SUPPORT.getRegexFormSupport(null).subscribe(res => {
      let dataOffertRegex = JSON.parse(res.body.body);
      dataOffertRegex = dataOffertRegex.Data.filter(data => data.Module === 'dashboard');
      for (const val in this.BrandsRegex) {
        if (!!val) {
          const element = dataOffertRegex.find(regex => regex.Identifier === val.toString());
          this.BrandsRegex[val] = element && `${element.Value}`;
        }
      }
      this.createFormControls();
    });
  }
  /**
   * funcion que dispara un evento para buscar un vendedor y traer la informacion correspondiente
   *
   * @memberof CalificationListComponent
   */
  eventEmitSearch() {
    this.searchSubscription = this.eventsSeller.eventSearchSeller.subscribe((seller: StoreModel) => {
      this.idSeller = seller.IdSeller;
      this.nameSeller = seller.Name;
      this.onlyOne = true;
      const paramsArray = {
        'limit': this.pageSize + '&paginationToken=' + encodeURI('{}'),
        'idSeller': this.idSeller,
        'callOne': true,
      };
      this.getCalificationsBySeller(paramsArray);
    });
  }
  /**
   * funcion para paginar las informacion de un vendedor con diferentes calificaciones
   *
   * @param {*} event
   * @memberof CalificationListComponent
   */
  paginations(event: any) {
    if (event) {
      const index = event.param.pageIndex;
      if (event.param.pageSize !== this.pageSize) {
        this.setItemsByPage(event.param.pageSize);
        this.validateArrayPositionPaginationToken();
      } else {
        this.querySearch = '';
      }
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
        this.isClear = true;
      }
      const params = {
        'limit': this.pageSize + '&paginationToken=' + encodeURI(this.paginationToken),
        'idSeller': this.idSeller,
        'dateInitQualityMonth': this.dateInitQualityMonth,
        'dateFinalQualityMonth': this.dateFinalQualityMonth,
        'dateInitQualityIssued': this.dateInitQualityIssued,
        'dateFinalQualityIssued': this.dateFinalQualityIssued,
      };
      this.getCalificationsBySeller(params);
    }
  }
  /**
   *  funcion para setear el tamaño de la pagina
   *
   * @param {*} size
   * @memberof CalificationListComponent
   */
  setItemsByPage(size: any) {
    this.pageSize = size;
  }
  /**
   * funcion para validar la posicion del array del pagination token
   *
   * @memberof CalificationListComponent
   */
  validateArrayPositionPaginationToken() {
    if (this.arrayPosition && this.arrayPosition.length > 0) {
      this.arrayPosition = [];
      this.isClear = true;
    }
  }
  /**
   * funcion para consultar las calificaciones de un vendedor y listarla
   *
   * @param {*} [params]
   * @memberof CalificationListComponent
   */
  getCalificationsBySeller(params?: any) {
    this.loadingService.viewSpinner();
    this.params = this.setParameters(params);
    this.calificationService.getListCalificationsBySeller(this.params).subscribe((res: any) => {
      if (res) {
        this.setTable(res);
        this.loadingService.closeSpinner();
      }
    }, error => {
      this.loadingService.closeSpinner();
      this.snackBar.open(this.languageService.instant('secure.orders.send.error_ocurred_processing'), this.languageService.instant('actions.close'), {
        duration: 3000,
      });
    });
  }
  /**
   * funcion para setear los parametros a variables de las consultas
   *
   * @param {*} params
   * @returns
   * @memberof CalificationListComponent
   */
  setParameters(params: any) {
    if (params && params.callOne) {
      this.paginationToken = '{}';
      this.arrayPosition = [];
    }
    if (params && params.clear) {
      this.dateInitQualityMonth = '';
      this.dateFinalQualityMonth = '';

      this.dateInitQualityIssued = '';
      this.dateFinalQualityIssued = '';
    }
    let calificationsParams = '';
    if (this.idSeller) {
      calificationsParams = this.idSeller + '/';
    }
    if (this.dateInitQualityMonth) {
      calificationsParams += this.dateInitQualityMonth + '/';
    } else {
      calificationsParams += 'null/';
    }
    if (this.dateFinalQualityMonth) {
      calificationsParams += this.dateFinalQualityMonth + '/';
    } else {
      calificationsParams += 'null/';
    }
    if (this.dateInitQualityIssued) {
      calificationsParams += this.dateInitQualityIssued + '/';
    } else {
      calificationsParams += 'null/';
    }
    if (this.dateFinalQualityIssued) {
      calificationsParams += this.dateFinalQualityIssued + '/';
    } else {
      calificationsParams += 'null/';
    }
    if (this.paginationToken) {
      calificationsParams += encodeURI(this.paginationToken) + '/';
    } else {
      this.calificationsParams += 'null/';
    }
    if (this.pageSize) {
      calificationsParams += this.pageSize;
    } else {
      calificationsParams += '50';
    }

    return calificationsParams;
  }
  /**
   * funcion para guardar el pagination tocken y setear la tabla
   *
   * @param {*} res
   * @memberof CalificationListComponent
   */
  setTable(res: any) {
    if (res) {
      if (this.onlyOne) {
        this.length = res.count;
        this.arrayPosition = [];
        this.arrayPosition.push('{}');
      }
      this.showEmpty = false;
      if (res && res.count && res.count > 0) {
        this.sortedData = this.mapItems(
          res.viewModel,
        );
      } else {
        this.sortedData = null;
      }
      this.dataSource = new MatTableDataSource(this.sortedData);
      this.savePaginationToken(res.paginationToken);
    } else {
      this.length = 0;
      this.showEmpty = false;
    }
    this.onlyOne = false;
  }
  /**
   * funcion para mapear la respuesta de del back
   *
   * @param {any[]} items
   * @returns {any[]}
   * @memberof CalificationListComponent
   */
  mapItems(items: any[]): any[] {
    return items.map(x => {
      return {
        idSeller: x.idSeller,
        qualitative: x.qualitative,
        qualificationDate: x.qualificationDate,
        generatedDate: x.generatedDate,
        qualificationDateFormt: this.formtDateMonthYear(x.qualificationDate),
        generatedDateFormt: this.formtDateMonthYear(x.generatedDate),
      };
    });
  }
  /**
   * funcion para formatear la fecha que se muesta en la pantalla mes y año
   *
   * @param {*} date
   * @returns
   * @memberof CalificationListComponent
   */
  formtDateMonthYear(date: any) {
    const formtDateMonth = date.toString().substr(-2, 2);
    const formtDateYear = date.toString().substr(-20, 4);
    return formtDateMonth + '/' + formtDateYear;
  }
  /**
   * funcion para formatear la fecha que se muesta en la pantalla DD/MM/AAAA
   *
   * @param {*} date
   * @returns
   * @memberof CalificationListComponent
   */
  formtDateDayMonthYear(date: any) {
    const format = 'DD/MM/YYYY';
    const stringDate = moment(date.toString()).utc().format(format).toString();
    // return stringDate;
    return date;
  }
  /**
   * funcion para setear el pagination token a una variable de global
   *
   * @param {string} paginationToken
   * @memberof CalificationListComponent
   */
  savePaginationToken(paginationToken: string) {
    if (paginationToken) {
      this.paginationToken = paginationToken;
    }
  }
  /**
   * funcion para consumir el detalle de un vendedor y de una calificacion, ocultar el listado y mostrar el detalle
   *
   * @param {string} qualificationDate
   * @param {number} idSeller
   * @memberof CalificationListComponent
   */
  contentDetails(qualificationDate: string, idSeller: number) {
    this.loadingService.viewSpinner();
    let dataFormt = '';
    if (qualificationDate && idSeller) {
      if (qualificationDate.includes('/')) {
        const arrayDate = qualificationDate.split('/');
        dataFormt = arrayDate[1] + arrayDate[0];
      }
      const params = idSeller + '/' + dataFormt;
      this.calificationService.getListCalificationsBySeller(params).subscribe((res: any) => {
        if (res) {
          this.detailByElemet = res.viewModel;
          this.loadingService.closeSpinner();
          this.showContainerDetail = true;
        }
      }, error => {
        this.loadingService.closeSpinner();
        this.snackBar.open(this.languageService.instant('secure.orders.send.error_ocurred_processing'), this.languageService.instant('actions.close'), {
          duration: 3000,
        });
      });
    }
  }
  /**
   * funcion para mostrar el menu de filtros
   *
   * @memberof CalificationListComponent
   */
  toggleFilterCalifications() {
    // this.showSelectorMouthQuality = true;
    // this.showSelectorMouthEmit =  true;
    // this.rdCalification.checked = false;
    // this.rdEmit.checked = false;
    this.sidenavSearchOrder.toggle();
  }

  /**
   * funcion para filtrar calificaciones
   *
   * @param {*} form
   * @memberof CalificationListComponent
   */
  filterCalification(form: any) {

    if (form) {
      if (form.dateInitQualityMonth) {
        this.dateInitQualityMonth = this.formtDateYearMonth(form.dateInitQualityMonth);
      }
      if (form.dateFinalQualityMonth) {
        this.dateFinalQualityMonth = this.formtDateYearMonth(form.dateFinalQualityMonth);
      }
      if (form.dateInitQualityIssued) {
        this.dateInitQualityIssued = this.formtDateYearMonth(form.dateInitQualityIssued);
      }
      if (form.dateFinalQualityIssued) {
        this.dateFinalQualityIssued = this.formtDateYearMonth(form.dateFinalQualityIssued);
      }
    }
    const params = {
      callOne: true,
    };
    this.getCalificationsBySeller(params);
    this.toggleFilterCalifications();
    // this.clearForm();
  }
  /**
   * funcion intercambiar la posicion del mes y el año
   *
   * @param {string} valueDate
   * @returns
   * @memberof CalificationListComponent
   */
  formtDateYearMonth(valueDate: string) {
    if (valueDate && valueDate.includes('/')) {
      const arrayDate = valueDate.split('/');
      return arrayDate[1] + arrayDate[0];
    }
  }
  /**
   * funcion para mostar el mes y el año
   *
   * @param {string} date
   * @returns
   * @memberof CalificationListComponent
   */
  formatNameMonth(date: string) {
    const formtDateMonth = date.toString().substr(-2, 2);
    const formtDateYear = date.toString().substr(-20, 4);
    const month = this.monthES[parseInt(formtDateMonth, 0) - 1];
    return month + ' (' + formtDateYear + ')';
  }
  /**
   * funcion para limpiar el formulario
   *
   * @memberof CalificationListComponent
   */
  clearForm() {
    this.filterCalifications.reset();
    this.dateInitQualityMonth = '';
    this.dateFinalQualityMonth = '';
    this.dateInitQualityIssued = '';
    this.dateFinalQualityIssued = '';
    this.params = {
      callOne: 'true'
    };
    this.getCalificationsBySeller(this.params);
    this.toggleFilterCalifications();
  }
  /**
   * funcion para ocultar el detalle y mostrar el listado de las calificaciones por vendedor
   *
   * @memberof CalificationListComponent
   */
  backListCalifications() {
    this.showContainerDetail = false;
  }

  changeSizeTable(event: any) { }

  selectorFilter(selector: number) {
    if (selector === 1) {
        this.showSelectorMouthQuality = false;
        this.showSelectorMouthEmit = true;
    } else {
      this.showSelectorMouthQuality = true;
      this.showSelectorMouthEmit = false;
    }
  }

}
