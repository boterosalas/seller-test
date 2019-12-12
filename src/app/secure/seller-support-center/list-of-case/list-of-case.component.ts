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
  pageIndex = 1;
  pageSize = 50;
  filterParams: any;
  unreadCase: number;

  configDialog = {
    width: '70%',
    height: 'fit-content',
    data: null
  };

  public log: Logger;

  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private sellerSupportService: SellerSupportCenterService,
    public router: ActivatedRoute,
    private store: Store<CoreState>,
    private loadingService?: LoadingService,
    private modalService?: ModalService,
    private storeService?: StoreService,
    private translateService?: TranslateService
  ) { }

  ngOnInit() {
    this.toggleFilter(this.filter);
    this.getStatusCase();
    this.filterByRoute(this.router.queryParams).subscribe(res =>
      this.loadCases(res)
    );
    this.store
      .select(reduxState => reduxState.notification.unreadCases)
      .subscribe(unreadCase => (this.unreadCase = unreadCase));

    this.translateService.onLangChange.subscribe(e => {
      setTimeout(() => { this.loadCases([]); }, 350);
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

  changePagination(pagination: any) {
    const { pageIndex, pageSize } = pagination;
    this.loadCases({ PageSize: pageSize, Page: pageIndex });
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
    this.sellerSupportService.getAllCase(filter).subscribe(
      res => {
        if (res && res['status'] === 200) {
          if (res.body) {
            const { pageSize, page } = res.body.data;
            this.cases = res.body.data.cases;
            this.refreshPaginator(res.body.data.total, page, pageSize);
            this.loadingService.closeSpinner();
          }
        }
      },
      err => {
        this.modalService.showModal('errorService');
        this.loadingService.closeSpinner();
      }
    );
  }

  refreshPaginator(total: number, page: number, limit: number) {
    this.length = total;
    this.pageSize = limit;
    this.pageIndex = page - 1;
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
