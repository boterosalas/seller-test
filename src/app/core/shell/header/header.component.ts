import { Component, Input, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { Logger } from '@app/core/util/logger.service';
import { RoutesConst } from '@app/shared/util/routes.constants';
import { LoggedInCallback, UserLoginService, UserParametersService } from '@core/aws-cognito';
import { UserInformation } from '@app/shared';
import { MatDialog } from '@angular/material';
import { SupportModalComponent } from '@app/secure/support-modal/support-modal.component';
import { LoadingService } from '@app/core/global';
import { CoreState } from '@app/store';
import { Store, select } from '@ngrx/store';
import { listSchoolExito, MenuModel, visualizeFunctionality } from '@app/secure/auth/auth.consts';
import { AuthService } from '@app/secure/auth/auth.routing';


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
  public userLoggin: boolean;
  public sellerName: any;
  public sellerId: any;
  public routes: any;
  public unreadCase: number;
  sumadevolution: number;
  isAdmin = false;

  permissionComponent: MenuModel;
  canView: boolean;


  constructor(
    private userService: UserLoginService,
    private userParams: UserParametersService,
    private router: Router,
    public authService: AuthService,
    private loadingService: LoadingService,
    public dialog: MatDialog,
    private store: Store<CoreState>
  ) { }

  /**
   * @memberof HeaderComponent
   */
  ngOnInit() {
    this.userService.isAuthenticated(this);
    this.getDataUser();
    this.store
      .pipe(select(state => state.notification))
      .subscribe(
        notificationState => {
          this.unreadCase = notificationState.unreadCases;
          this.sumadevolution = notificationState.sumaUnreadDevolutions;
        }
      );
  }

  async isLoggedIn(message: string, isLoggedIn: boolean) {
    if (isLoggedIn) {
      this.user = await this.userParams.getUserData();
      if (this.user && this.user.sellerId) {
        localStorage.setItem('userId', this.user.sellerId);
        localStorage.setItem('email', this.user.sellerEmail);
      }
      this.routes = RoutesConst;
    }
  }

  openDialogSupport(): void {
    this.loadingService.viewProgressBar();
    const dialogRef = this.dialog.open(SupportModalComponent, {
      width: '90%',
      panelClass: 'full-width-dialog'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadingService.closeProgressBar();
    });
  }
  async getDataUser() {
    this.user = await this.userParams.getUserData();
    if (this.user.sellerProfile !== 'seller' && this.user.sellerProfile && this.user.sellerProfile !== null) {
      this.isAdmin = true;
      this.permissionComponent = this.authService.getMenuProfiel(listSchoolExito, 1);
      this.setPermission(1);
    } else {
      this.isAdmin = false;
      this.permissionComponent = this.authService.getMenuProfiel(listSchoolExito, 0);
      this.setPermission(0);
    }
  }
  /**
   * Seteo permiso para editar
   * @param {number} typeProfile
   * @memberof ListProductsComponent
   */
  setPermission(typeProfile: number) {
    this.canView = this.getFunctionality(visualizeFunctionality);
  }
  public getFunctionality(functionality: string): boolean {
    if (this.permissionComponent && this.permissionComponent.Functionalities) {
      const permission = this.permissionComponent.Functionalities.find(result => functionality === result.NameFunctionality);
      return permission && permission.ShowFunctionality;
    } else {
      return null;
    }
  }
}
