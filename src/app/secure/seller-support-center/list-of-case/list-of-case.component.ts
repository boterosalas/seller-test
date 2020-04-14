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
import { MatDialog, MatSnackBar } from '@angular/material';
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

@Component({
  selector: 'app-list-of-case',
  templateUrl: './list-of-case.component.html',
  styleUrls: ['./list-of-case.component.scss'],
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
  pageSize = 50;
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

  paramsFilter: any = {};
  arrayTokens: Array<any> = ['{}'];

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
    private profileService?: MyProfileService
  ) {
    this.getAllDataUser();
  }

  ngOnInit() {
    this.toggleFilter(this.filter);
    this.getStatusCase();
    this.filterByRoute(this.router.queryParams).subscribe(res => {
      const seller = this.paramsFilter.SellerId;
      this.paramsFilter = {};
      // Const para eliminar filtros y sobreescribirlos.
      if (seller) {
        res.SellerId = res;
      }
      Object.assign(this.paramsFilter, res);
      this.loadCases(this.paramsFilter);
    });
    // this.loadCases();
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
      // const dataSeller = data.IdSeller;
      const dataSeller = {
        'SellerId': data.IdSeller
      };
      Object.assign(this.paramsFilter, dataSeller);
      this.loadCases();
    });
  }


  async getAllDataUser() {
    this.loadingService.viewSpinner();
    const sellerData = await this.profileService.getUser().toPromise().then(res => {
      const body: any = res.body;
      const response = JSON.parse(body.body);
      const userData = response.Data;
      this.sellerId = userData.IdSeller;
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
    if (filter.Limit) {
      this.paramsFilter = filter;
    }
    console.log('this.paramsFilter: ', this.paramsFilter);
    this.loadingService.viewSpinner();
    this.sellerSupportService.getAllCase(this.paramsFilter).subscribe(
      res => {
        if (res && res['status'] === 200) {
          if (res.body) {
            const { pageSize, page } = res.body.data;
            this.refreshPaginator(res.body.data.total, page, pageSize);
            this.paginationToken = res.body.paginationToken;
            this.savePaginationToken(this.paginationToken);
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

  changePagination(pagination: any) {
    console.log(pagination);
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


    // this.arrayTokens.push(this.paginationToken);
    const { pageIndex, pageSize } = pagination;
    // let token;
    // if (pageIndex === 0) {
    //   token = '{}';
    // } else {
    //   token = this.paginationToken;
    // }
    this.loadCases({ Limit: pageSize , paginationToken: this.paginationToken});
    console.log(this.arrayTokens);
  }

  refreshPaginator(total: number, page: number, limit: number) {
    this.pageSize = limit;
    if (this.paginationToken === '{}') {
      this.length = total;
      this.pageIndex = 0;
    } else {
      this.pageIndex = page - 1;
    }
    // this.length = total;
    // this.pageIndex = page - 1;
  }

  savePaginationToken(paginationToken: string) {
    // this.arrayTokens = [];
    console.log('paginationToken: ', paginationToken);
    if (paginationToken) {
      this.paginationToken = paginationToken;
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
