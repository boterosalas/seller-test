import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoggedInCallback, UserLoginService, UserParametersService } from '@app/core';
import { RoutesConst, UserInformation } from '@app/shared';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit, LoggedInCallback {
  public user: UserInformation;

  public tree: any;

  constructor(
    public userService: UserLoginService,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    public userParams: UserParametersService
  ) { }

  ngOnInit() {
    this.userService.isAuthenticated(this);
  }

  isLoggedIn(message: string, isLoggedIn: boolean) {
    if (isLoggedIn) {
      this.getDataUser();
    } else if (!isLoggedIn) {
      this.router.navigate([`/${RoutesConst.home}`]);
    }

  }

  getDataUser() {
    this.user = this.userParams.getUserData();
    if (this.user.sellerProfile === 'seller') {
      this.router.navigate([`/${RoutesConst.sellerCenterOrders}`]);
    }
  }


  receiveDataTree($event: any) {
    if ($event && $event !== undefined && $event !== null) {
      this.tree = $event;
      this.cdRef.detectChanges();
    }
  }
}
