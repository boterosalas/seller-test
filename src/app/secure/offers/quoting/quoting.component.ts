import { Component, OnInit, HostListener } from '@angular/core';
import { UserInformation, RoutesConst } from '@app/shared';
import { UserLoginService, UserParametersService } from '@app/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quoting',
  templateUrl: './quoting.component.html',
  styleUrls: ['./quoting.component.scss']
})
export class QuotingComponent implements OnInit {

  public user: UserInformation;
  public userRol: string;
  public numberOfClicks = 0;
  constructor(
    private userService: UserLoginService,
    private router: Router,
    private userParams: UserParametersService
  ) { }

  ngOnInit(): void {
    this.userService.isAuthenticated(this);
  }

  async isLoggedIn(message: string, isLoggedIn: boolean) {
    if (isLoggedIn) {
      this.user = await this.userParams.getUserData();
      this.userRol = this.user.sellerProfile === 'seller' ? 'Cotizador vendedor' : this.user.sellerProfile === 'administrator' ? 'Cotizador administrador' : null;
    } else if (!isLoggedIn) {
      this.router.navigate([`/${RoutesConst.home}`]);
    }
  }

}
