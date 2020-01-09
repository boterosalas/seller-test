import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/secure/auth/auth.routing';
import { UserInformation } from '@app/shared';
import { MenuModel, citiesCoverageName } from '@app/secure/auth/auth.consts';
import { UserParametersService } from '@app/core';

@Component({
  selector: 'app-cities-coverage',
  templateUrl: './cities-coverage.component.html',
  styleUrls: ['./cities-coverage.component.scss']
})
export class CitiesCoverageComponent implements OnInit {

  public user: UserInformation;
  public permissionComponent: MenuModel;
  public typeProfile: number;

  constructor(
    private __authService: AuthService,
    private __userParams: UserParametersService
  ) { }

  ngOnInit() {
    this.getDataUser();
  }

  private async getDataUser(){
    this.user = await this.__userParams.getUserData();
    if (this.user.sellerProfile === 'seller') {
      this.permissionComponent = this.__authService.getMenuProfiel(citiesCoverageName, 0);
      this.typeProfile = 0;
    } else {
      this.permissionComponent = this.__authService.getMenuProfiel(citiesCoverageName, 1);
      this.typeProfile = 1;
    }
  }

}
