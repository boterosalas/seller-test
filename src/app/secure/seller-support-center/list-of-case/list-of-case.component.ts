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
import { MatDialog } from '@angular/material';
import { LoadingService, ModalService } from '@app/core';
import { Logger } from '@core/util/logger.service';

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
  repondCase;

  listConfiguration: Array<any>;

  totalPages;
  pages;
  pageSize;

  configDialog = {
    width: '70%',
    height: 'fit-content',
    data: null
  };

  public log: Logger;

  constructor(
    public dialog: MatDialog,
    private sellerSupportService: SellerSupportCenterService,
    private loadingService?: LoadingService,
    private modalService?: ModalService
  ) {}

  ngOnInit() {
    this.listConfiguration = this.sellerSupportService.getListHeaderConfiguration();
    this.toggleFilter(this.filter);
    this.getStatusCase();
    this.loadAllCases();
  }

  toggleFilter(stateFilter: boolean) {
    this.filter = stateFilter;

    this.menuState = stateFilter ? 'in' : 'out';
  }

  loadAllCases() {
    this.loadingService.viewSpinner();

    this.sellerSupportService.getAllCase({ Page: 1, PageSize: 100 }).subscribe(
      res => {
        this.cases = res.data.cases;
        this.loadingService.closeSpinner();
      }, err => {
        this.loadingService.closeSpinner();
        this.log.debug(err);
        this.modalService.showModal('errorService');
      }
    );
  }

  getStatusCase() {
    this.sellerSupportService.getAllStatusCase().subscribe(res => {
      this.options = res.data;
    });
  }

  getAllCases(filter?: any) {
    this.sellerSupportService.getAllCase(filter).subscribe(
      res => {
        const { pageSize, page, totalPages } = res.data;
        this.cases = res.data.cases;
        this.loadingService.closeSpinner();
        this.refreshPaginator(totalPages, page, pageSize);
      },
      err => {
        this.loadingService.closeSpinner();
        this.log.debug(err);
        this.modalService.showModal('errorService');
      }
    );
  }

  submitFilter(filterForm: any) {
    this.getAllCases(filterForm);
  }

  refreshPaginator(total: any, page: any, limit: any) {
    this.totalPages = total;
    this.pageSize = limit;
    this.pages = page;
  }

  onEmitResponse(caseResponse: any) {
    this.configDialog.data = caseResponse;

    const dialogRef = this.dialog.open(
      ResponseCaseDialogComponent,
      this.configDialog
    );

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.sellerSupportService.patchCaseResponse(result.data).subscribe(
          res=> this.reloadLastResponse(res)
        );
      }
    });
  }

  reloadLastResponse(result: any) {
    let newCase = this.cases.find(element => element.id === result.data.id);
    newCase.followLast = result.data.follow;
    newCase.read = result.data.read;
    result = {};
    newCase = {};
  }
}
