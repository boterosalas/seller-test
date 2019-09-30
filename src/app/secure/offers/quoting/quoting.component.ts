import { Component, OnInit, HostListener } from '@angular/core';
import { UserInformation, RoutesConst } from '@app/shared';
import { UserLoginService, UserParametersService } from '@app/core';
import { Router } from '@angular/router';
import { SelectLanguageService } from '@app/shared/components/select-language/select-language.service';

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
    private userParams: UserParametersService,
    private languageService: SelectLanguageService
  ) { }

  ngOnInit(): void {
    this.userService.isAuthenticated(this);
  }

  async isLoggedIn(message: string, isLoggedIn: boolean) {
    await this.languageService.language$.subscribe(async () => {
      if (isLoggedIn) {
        const sellerQuoting = this.languageService.instant('secure.offers.quoting.quoting_seller');
        const adminQuoting = this.languageService.instant('secure.offers.quoting.quoting_admin');
        this.user = await this.userParams.getUserData();
        this.userRol = this.user.sellerProfile === 'seller' ? sellerQuoting : this.user.sellerProfile === 'administrator' ? adminQuoting : null;
      } else if (!isLoggedIn) {
        this.router.navigate([`/${RoutesConst.home}`]);
      }
    });
  }

}
