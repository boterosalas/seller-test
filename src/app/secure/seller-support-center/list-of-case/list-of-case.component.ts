import { Component, OnInit } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';
import { SellerSupportCenterService } from '../services/seller-support-center.service';
import { ResponseCaseDialogComponent } from '@shared/components/response-case-dialog/response-case-dialog.component';
import { MatDialog, MatSnackBar, MatPaginatorIntl, ErrorStateMatcher } from '@angular/material';
import { LoadingService, ModalService } from '@app/core';
import { Logger } from '@core/util/logger.service';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  FetchUnreadCase,
  FetchUnreadCaseDone
} from '@app/store/notifications/actions';
import { CoreState } from '@app/store';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ConfigurationState } from '@app/store/configuration';
import { StoreService } from '@app/store/store.service';
import { TranslateService } from '@ngx-translate/core';
import { EventEmitterSeller } from '@app/shared/events/eventEmitter-seller.service';
import { MyProfileService } from '@app/secure/aws-cognito/profile/myprofile.service';
import { FormBuilder, FormGroup, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatPaginatorI18nService } from '@app/shared/services/mat-paginator-i18n.service';
import { CustomPaginator } from '@app/secure/products/list-products/listFilter/paginatorList';
import { SupportService } from '@app/secure/support-modal/support.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-list-of-case',
  templateUrl: './list-of-case.component.html',
  styleUrls: ['./list-of-case.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useValue: CustomPaginator() }
  ],
  animations: [
    trigger('slideInOut', [
      state(
        'in',
        style({
          transform: 'translate3d(0, 0, 0)'
        })
      ),
      state(
        'out',
        style({
          transform: 'translate3d(100%, 0, 0)'
        })
      ),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ])
  ]
})
export class ListOfCaseComponent implements OnInit {
  options: any;
  filter: boolean;
  menuState: string;
  cases: Array<any>;
  repondCase: any;
  headerConfigurations: Array<any>;
  length: number;
  pageIndex = 0;
  pageSize = 100;
  filterParams: any;
  unreadCase: number;

  configDialog = {
    width: '70%',
    height: 'fit-content',
    data: null
  };

  public paginationToken = '{}';

  public log: Logger;

  isAdmin: Boolean = false;
  sellerId: any;

  sellerIdLogger: any;

  paramsFilter: any = {};
  arrayTokens: Array<any> = ['{}'];

  public filterListCases: FormGroup;

  public valuePost: any;

  regexFilter = {
    caseNumber: '',
    orderNumber: ';'
  };

  // Modelo de ultima respuesta
  public lastPost = [
    { valuePost: 1, name: this.translateService.instant('secure.parametize.support_claims-filter.sac_answer') },
    { valuePost: 2, name: this.translateService.instant('secure.parametize.support_claims-filter.seller_answer') }
  ];

  filterDateInit: any;
  filterDateEnd: any;

  paramsFIlterListCase = {
    CaseNumber: '',
    LastPost: '',
    OrderNumber: '',
    Status: [],
    DateInit: '',
    DateEnd: '',
    SellerId: ''
  };
  filterLastPost: string;

  selectedCategory: string;
  hasErrorDate: boolean;

  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private sellerSupportService: SellerSupportCenterService,
    public router: ActivatedRoute,
    private store: Store<CoreState>,
    private loadingService?: LoadingService,
    private modalService?: ModalService,
    private storeService?: StoreService,
    private translateService?: TranslateService,
    private emitterSeller?: EventEmitterSeller,
    private profileService?: MyProfileService,
    private route?: ActivatedRoute,
    private fb?: FormBuilder,
    private formatDate?: DatePipe,
    public SUPPORT?: SupportService,

  ) {
    this.getAllDataUser();
    if (localStorage.getItem('sellerNameClaim')) {
      this.selectedCategory = localStorage.getItem('sellerNameClaim');
    }
  }

  ngOnInit() {
    this.createFormControls();
    this.validateFormSupport();

    this.getStatusCase();
    this.filterByRoute(this.router.queryParams).subscribe(res => {
      const seller = this.paramsFilter.SellerId;
      if (this.isAdmin) {
        if (seller) {
        }
        Object.assign(this.paramsFilter, res);
      } else {
        this.paramsFilter = {};
        // Const para eliminar filtros y sobreescribirlos.
        if (seller) {
          res.SellerId = res;
        }
        Object.assign(this.paramsFilter, res);
      }
      this.loadCases(this.paramsFilter);
    });
    // tslint:disable-next-line: deprecation
    this.store.select(reduxState => reduxState.notification.unreadCases)
      .subscribe(unreadCase => (this.unreadCase = unreadCase));

    this.translateService.onLangChange.subscribe(e => {
      setTimeout(() => {
        this.paramsFilter = {};
        this.loadCases([]);
      }, 350);
    });

    this.emitterSeller.eventSearchSeller.subscribe(data => {
      this.selectedCategory = data.Name;
      localStorage.setItem('sellerNameClaim', this.selectedCategory);
      this.sellerIdLogger = {
        'SellerId': data.IdSeller
      };
      Object.assign(this.paramsFilter, this.sellerIdLogger);
      this.loadCases(this.paramsFilter);
    });

  }

  /**
   * Metodo para crear control del formulario del filtro.
   * @memberof ListOfCaseComponent
   */
  createFormControls() {
    this.filterListCases = this.fb.group({
      CaseNumber: new FormControl('', [Validators.pattern(this.regexFilter.caseNumber)]),
      LastPost: new FormControl(''),
      DateInit: { disabled: true, value: '' },
      DateEnd: { disabled: true, value: '' },
      Status: new FormControl(''),
      OrderNumber: new FormControl('', [Validators.pattern(this.regexFilter.orderNumber)])
    });
  }

  /**
   * Metodo para utilizar exxpresiones regulares de Dynamo DB
   * @memberof ListOfCaseComponent
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
   * Metodo para aplicar el filtro con los parametros necesarios
   * @memberof ListOfCaseComponent
   */
  public filterApply() {
    this.paramsFIlterListCase.CaseNumber = this.filterListCases.controls.CaseNumber.value;
    this.paramsFIlterListCase.LastPost = this.filterListCases.controls.LastPost.value;
    this.paramsFIlterListCase.Status = [this.filterListCases.controls.Status.value];
    this.paramsFIlterListCase.OrderNumber = this.filterListCases.controls.OrderNumber.value;
    if (this.isAdmin) {
      this.paramsFIlterListCase.SellerId = this.paramsFilter.SellerId;
    }
    this.paramsFIlterListCase.DateInit = this.formatDate.transform(
      this.filterDateInit,
      'y-MM-d'
    );
    this.paramsFIlterListCase.DateEnd = this.formatDate.transform(
      this.filterDateEnd,
      'y-MM-d'
    );

    const urlIdSeller = this.route.snapshot.paramMap.get('idSeller');
    if (!this.paramsFIlterListCase.SellerId && urlIdSeller) {
      this.paramsFIlterListCase.SellerId = urlIdSeller;
    }

    if (!this.paramsFIlterListCase.SellerId) {
      delete this.paramsFIlterListCase.SellerId;
    }

    if (!this.paramsFIlterListCase.CaseNumber) {
      delete this.paramsFIlterListCase.CaseNumber;
    }
    if (!this.paramsFIlterListCase.LastPost) {
      delete this.paramsFIlterListCase.LastPost;
    }
    if (!this.paramsFIlterListCase.Status || this.paramsFIlterListCase.Status === null || this.paramsFIlterListCase.Status === []) {
      delete this.paramsFIlterListCase.Status;
    }
    if (!this.paramsFIlterListCase.OrderNumber) {
      delete this.paramsFIlterListCase.OrderNumber;
    }
    if (!this.paramsFIlterListCase.DateInit) {
      delete this.paramsFIlterListCase.DateInit;
    }
    if (!this.paramsFIlterListCase.DateEnd) {
      delete this.paramsFIlterListCase.DateEnd;
    }

    this.validateFinalDateRange();
    if (this.hasErrorDate === false) {
      this.loadCases(this.paramsFIlterListCase);
    }
  }

  /**
   * Funcion para validar que la fecha inicial no sea mayor a la fecha final
   * @param {boolean} show
   * @memberof ListOfCaseComponent
   */
  validateFinalDateRange() {
    this.hasErrorDate = false;
    const init = this.filterDateInit;
    const final = this.filterDateEnd;
    const sumDays = ((+new Date(final) - +new Date(init)) / 1000 / 60 / 60 / 24);
      if (+new Date(init) > +new Date(final)) {
        this.hasErrorDate = true;
        this.snackBar.open(this.translateService.instant('secure.products.create_product_unit.list_products.date_must_no_be_initial_date'), this.translateService.instant('actions.close'), {
          duration: 4000,
        });
      } else {
        if (sumDays > 15) {
          this.hasErrorDate = true;
          this.snackBar.open(this.translateService.instant('secure.parametize.support_claims.list.error.rangeDate'), this.translateService.instant('actions.close'), {
            duration: 4000,
          });
        }
      }
  }

  /**
   * Metodo para limpiar datos del formulario de filtro y volver a realizar el loadcases con los parametros necesarios.
   * @memberof ListOfCaseComponent
   */
  public cleanFilter() {
    if (this.isAdmin) {
      this.filterListCases.reset();
      this.filterApply();
    } else {
      this.filterListCases.reset();
      this.loadCases(this.filterListCases.value);
    }
  }

  /**
   * Metodo para obtener información del usuario logueado
   * @memberof ListOfCaseComponent
   */
  async getAllDataUser() {
    this.loadingService.viewSpinner();
    const sellerData = await this.profileService.getUser().toPromise().then(res => {
      const body: any = res.body;
      const response = JSON.parse(body.body);
      const userData = response.Data;
      this.sellerId = userData.IdSeller;
      localStorage.setItem('typeProfile', userData.Profile);
      if (userData.Profile !== 'seller') {
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
      }
      this.loadingService.closeSpinner();
      return userData;
    });
  }


  filterByRoute(queryParams: Observable<any>): Observable<any> {
    return queryParams.pipe(
      map((res: any) =>
        res.Status && res.Status.length > 0 ? res : { ...res, init: true }
      )
    );
  }

  toggleFilter(stateFilter: boolean) {
    this.filter = stateFilter;
    this.menuState = stateFilter ? 'in' : 'out';
  }

  getStatusCase() {
    this.storeService.getStateConfiguration().subscribe((res: ConfigurationState) => {
      const arrayLang = this.sellerSupportService.getListHeaderConfiguration();
      switch (res.language) {
        case 'ES':
          this.headerConfigurations = arrayLang[0].ES;
          break;

        case 'US':
          this.headerConfigurations = arrayLang[1].US;
          break;

        default:
          this.headerConfigurations = [];
      }
      this.options = res.statusCases;
    });
  }

  loadCases(filter?: any) {
    this.loadingService.viewSpinner();
    const urlIdSeller = this.route.snapshot.paramMap.get('idSeller');
    if (!filter.SellerId && urlIdSeller) {
      filter.SellerId = urlIdSeller;
    }
    this.sellerSupportService.getAllCase(filter).subscribe(
      res => {
        if (res && res['status'] === 200) {
          if (res.body) {
            const { pageSize, page } = res.body.data;
            this.length = res.body.data.total;
            this.refreshPaginator(this.length, res.body.data.page, res.body.data.pageSize);
            this.paginationToken = res.body.paginationToken;
            this.cases = res.body.data.cases;
            this.loadingService.closeSpinner();
          }
        }
        this.loadingService.closeSpinner();
      },
      err => {
        this.modalService.showModal('errorService');
        this.loadingService.closeSpinner();
      }
    );
  }

  /**
   * Método para ejecutar la paginacion, que recibe evento que escucha el paginado
   * @param {*} pagination
   * @memberof ListOfCaseComponent
   */
  changePagination(pagination: any) {
    const index = pagination.pageIndex;

    if (index === 0) {
      this.paginationToken = '{}';
    }
    const isExistInitial = this.arrayTokens.includes('{}');
    if (isExistInitial === false) {
      this.arrayTokens.push('{}');
    }

    // Se guarda el paginaation token que envia back
    const isExist = this.arrayTokens.includes(this.paginationToken);
    if (isExist === false) {
      this.arrayTokens.push(this.paginationToken);
    }

    this.paginationToken = this.arrayTokens[index];
    if (this.paginationToken === undefined) {
      this.paginationToken = '{}';
    }

    const { pageIndex, pageSize } = pagination;

    if (this.isAdmin) {
      this.loadCases({ SellerId: this.sellerIdLogger.SellerId, Limit: pageSize, paginationToken: this.paginationToken });
    } else {
      this.loadCases({ Limit: pageSize, paginationToken: this.paginationToken });
    }
  }

  refreshPaginator(total: number, page: number, limit: number) {
    this.pageSize = limit;
    if (this.paginationToken === '{}') {
      this.length = total;
      this.pageIndex = 0;
    } else {
      this.pageIndex = page - 1;
    }
  }


  onEmitResponse(caseResponse: any) {
    if (caseResponse.status === 'Cerrado') {
      this.snackBar.open(
        'El caso ya se encuentra en estado cerrado, no es posible agregar comentarios.',
        'Cerrar',
        {
          duration: 3000
        }
      );
    } else {
      this.showResponseModal(caseResponse);
    }
  }

  showResponseModal(caseResponse: any) {
    this.configDialog.data = caseResponse;
    const dialogRef = this.dialog.open(
      ResponseCaseDialogComponent,
      this.configDialog
    );

    dialogRef.afterClosed().subscribe(result => {
      this.loadingService.viewSpinner();
      if (result !== undefined) {
        this.sellerSupportService
          .patchCaseResponse(result.data)
          .subscribe(res => {
            this.reloadLastResponse(res);
            this.loadingService.closeSpinner();
          });
      } else {
        this.loadingService.closeSpinner();
      }
    });
  }

  reloadLastResponse(result: any) {
    let newCase = this.cases.find(element => element.id === result.data.id);
    newCase.followLast[0] = result.data.follow[0];
    newCase.read = result.data.read;
    result = {};
    newCase = {};
  }

  markAsRead(caseRead: any) {
    const caseId = { id: caseRead.id };
    this.sellerSupportService.patchReadCase(caseId).subscribe();

    if (!caseRead.read) {
      caseRead.read = true;
      this.unreadCase--;
      this.store.dispatch(new FetchUnreadCaseDone(this.unreadCase));
    }
  }
}
