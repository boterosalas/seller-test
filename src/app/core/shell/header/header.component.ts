import { Component, Input, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { Logger } from '@app/core/util/logger.service';
import { RoutesConst } from '@app/shared/util/routes.constants';
import { LoggedInCallback, UserLoginService, UserParametersService } from '@core/aws-cognito';
import { UserInformation } from '@app/shared';
import { MatDialog } from '@angular/material';
import { SupportModalComponent } from '@app/secure/support-modal/support-modal.component';
import { LoadingService } from '@app/core/global';


// log component
const log = new Logger('HeaderComponent');

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})

export class HeaderComponent implements OnInit, LoggedInCallback {

  // booleano para visualizar la barra de toolbar
  @Input() viewToolbarPrincipal: boolean;
  // Información del usuario
  @Input() user: UserInformation;
  // Sidenav principal
  @Input() sidenav;
  public userLoggin: boolean;
  public sellerName: any;
  public sellerId: any;
  public routes: any;

  constructor(
    private userService: UserLoginService,
    private userParams: UserParametersService,
    private router: Router,
    private loadingService: LoadingService,
    public dialog: MatDialog,
  ) { }

  /**
   * @memberof HeaderComponent
   */
  ngOnInit() {
    this.userService.isAuthenticated(this);
  }

  async isLoggedIn(message: string, isLoggedIn: boolean) {
    if (isLoggedIn) {
      this.user = await this.userParams.getUserData();
      this.routes = RoutesConst;
    }
  }

  goToHome() {
    if (this.user.sellerProfile === 'administrator') {
      this.router.navigate([`/${RoutesConst.sellerCenterIntSellerRegister}`]);
    } else if (this.user.sellerProfile === 'seller') {
      this.router.navigate([`/${RoutesConst.secureSeller}`]);
    }
  }

  /**
   * Funcionalidad que permite desplegar el menú.
   * @memberof HeaderComponent
   */
  toggleMenu() {
    this.sidenav.toggle();
  }

  openDialogSupport(): void {
    console.log('aqui');
    this.loadingService.viewProgressBar();
    const dialogRef = this.dialog.open(SupportModalComponent, {
      width: '90%',
      panelClass: 'full-width-dialog'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadingService.closeProgressBar();
    });
  }
}
