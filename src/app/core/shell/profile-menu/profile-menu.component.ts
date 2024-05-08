import { Component, OnDestroy, OnInit } from '@angular/core';
import { RoutesConst } from '@app/shared/util/routes.constants';
import { UserInformation } from '@app/shared';
import { UserParametersService } from '@core/aws-cognito';
import { MatDialog } from '@angular/material';
import { SupportModalComponent } from '@app/secure/support-modal/support-modal.component';
import { LoadingService } from '@app/core/global';
import { Subscription } from 'rxjs';
import { UtilsService } from '@app/shared/services/utils.service';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.scss']
})
export class ProfileMenuComponent implements OnInit, OnDestroy {

  public routesConst = RoutesConst;
  user: UserInformation = {} as any;
  shortName: string = 'NN';
  supportModalComponent$: Subscription = new Subscription();

  constructor(
    private userParams: UserParametersService,
    private matDialog: MatDialog,
    private loadingService: LoadingService,
    private utilsService: UtilsService
  ) { }

  ngOnInit() {
    this.getDataUser();
  }

  async getDataUser() {
    this.user = await this.userParams.getUserData();
    this.shortName = this.utilsService.getShortName(this.user);
  }

  openDialogSupport(): void {
    this.loadingService.viewProgressBar();
    this.supportModalComponent$ = this.matDialog.open(SupportModalComponent, {
      width: '90%',
      panelClass: 'full-width-dialog'
    }).afterClosed().subscribe(() => {
      this.loadingService.closeProgressBar();
    });
  }

  ngOnDestroy(): void {
    this.supportModalComponent$.unsubscribe();
  }

}
