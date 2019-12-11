import { Component, OnInit } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';
import { SellerSupportCenterService } from '../services/seller-support-center.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CaseDetailResponse } from '../models/case-detail-response.model';
import { LoadingService } from '@app/core';
import { Logger } from '@core/util/logger.service';
import { ResponseCaseDialogComponent } from '@shared/components/response-case-dialog/response-case-dialog.component';
import { MatDialog } from '@angular/material';
import { StoreService } from '@app/store/store.service';
import { ConfigurationState } from '@app/store/configuration';

@Component({
  selector: 'app-detail-case',
  templateUrl: './detail-case.component.html',
  styleUrls: ['./detail-case.component.scss'],
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
export class DetailCaseComponent implements OnInit {
  public log: Logger;
  menuState: string;
  options: any;
  filter: boolean;
  headerConfigurations: any;
  case$: Observable<any>;
  configDialog = {
    width: '70%',
    height: 'fit-content',
    data: null
  };
  filterParams: any;

  constructor(
    public dialog: MatDialog,
    private sellerSupportService: SellerSupportCenterService,
    private route: ActivatedRoute,
    private loadingService?: LoadingService,
    private storeService?: StoreService
  ) {
    this.headerConfigurations = this.sellerSupportService.getListHeaderConfiguration();
  }

  ngOnInit(): void {
    this.loadingService.viewSpinner();
    this.toggleFilter(this.filter);
    this.getStatusCase();

    this.case$ = this.sellerSupportService
      .getCase(this.route.snapshot.paramMap.get('idCase'))
      .pipe(map((res: CaseDetailResponse) => res.data));

    this.case$.subscribe(() => this.loadingService.closeSpinner());
  }

  toggleFilter(stateFilter: boolean) {
    this.filter = stateFilter;
    this.menuState = stateFilter ? 'in' : 'out';
  }

  onEmitResponse(caseResponse: any) {
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
            this.case$ = of(res.data);
            this.loadingService.closeSpinner();
          });
      } else {
        this.loadingService.closeSpinner();
      }
    });
  }

  getStatusCase() {
    this.storeService.getStateConfiguration().subscribe((res: ConfigurationState) => {
      this.options = res.statusCases;
    });
  }
}
