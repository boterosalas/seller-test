import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewChild,
  OnInit
} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatPaginator, MatPaginatorIntl } from '@angular/material';
import { getDutchPaginatorIntl } from '@app/shared';
import { TranslateService } from '@ngx-translate/core';
import { MatPaginatorI18nService } from '@app/shared/services/mat-paginator-i18n.service';
import { EventEmitterSeller } from '@app/shared/events/eventEmitter-seller.service';
import { LoadingService } from '@app/core';
import { MyProfileService } from '@app/secure/aws-cognito/profile/myprofile.service';

@Component({
  selector: 'app-case-toolbar',
  templateUrl: './case-toolbar.component.html',
  styleUrls: ['./case-toolbar.component.scss'],
  providers: [
    {
      provide: MatPaginatorIntl,
      useClass: MatPaginatorI18nService,
    }
  ]
})
export class CaseToolbarComponent implements OnInit {
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  @Input() length: number;

  @Input() pageIndex: number;

  @Input() pageSize: number;

  @Input() pageLabel: string;

  @Output() changePagination = new EventEmitter();

  @Output() sellerDataSearch = new EventEmitter();

  @Output() toggleFilter = new EventEmitter();

  isHandset$: Observable<boolean>;

  stateFilter = false;

  isAdmin: boolean;
  constructor(private breakpointObserver: BreakpointObserver, public translateService: TranslateService,
    private emitterSeller?: EventEmitterSeller,
    private loadingService?: LoadingService,
    private profileService?: MyProfileService,
    ) {
    this.isHandset$ = this.breakpointObserver
      .observe(Breakpoints.Handset)
      .pipe(map(result => result.matches));
     this.getAllDataUser();
  }

  ngOnInit() {
    this.paginator.page.subscribe(pagination =>
      this.changePagination.emit(pagination)
    );

    this.emitterSeller.eventSearchSeller.subscribe(data => {
      this.sellerDataSearch.emit(data);
    });
  }

  async getAllDataUser() {
    this.loadingService.viewSpinner();
    const sellerData = await this.profileService.getUser().toPromise().then(res => {
      const body: any = res.body;
      const response = JSON.parse(body.body);
      const userData = response.Data;
      localStorage.setItem('typeProfile', userData.Profile);
      if (userData.Profile !== 'seller' && userData.Profile && userData.Profile !== null) {
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
      }
      this.loadingService.closeSpinner();
      return userData;
    });
  }

  onToggleFilter() {
    this.toggleFilter.emit(!this.stateFilter);
  }
}
