import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LoggedInCallback, Callback } from '../../../../../../service/cognito.service';
import { UserLoginService } from '../../../../../../service/user-login.service';
import { Router } from '@angular/router';
import { UserParametersService } from '../../../../../../service/user-parameters.service';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit, LoggedInCallback, Callback {
  public user: any;

  public tree: any;

  constructor(
    public userService: UserLoginService,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    public userParams: UserParametersService
  ) {
    this.user = {};
  }

  ngOnInit() {
    this.userService.isAuthenticated(this);
  }

  isLoggedIn(message: string, isLoggedIn: boolean) {
    if (isLoggedIn) {
      this.getDataUser();
      this.validateProfile();
    } else if (!isLoggedIn) {
      this.router.navigate(['/home']);
    }

  }

  callback() { }

  getDataUser() {
    this.userParams.getUserData(this);
  }

  callbackWithParam(userData: any) {
    this.user = userData;
  }

  validateProfile() {
    if (this.user.sellerProfile === 'seller') {
      this.router.navigate(['/securehome/seller-center/']);
    }
  }

  receiveDataTree($event) {
    if ($event && $event !== undefined && $event !== null) {
      this.tree = $event;
      this.cdRef.detectChanges();
    }
  }
}
