import { Component, OnInit } from '@angular/core';
import { UserParametersService } from '@app/core/aws-cognito';
import { UserInformation } from '@app/shared';
import { BreakpointService } from '@app/shared/services/breakpoint.service';
import { UtilsService } from '@app/shared/services/utils.service';

@Component({
  selector: 'app-floating-header',
  templateUrl: './floating-header.component.html',
  styleUrls: ['./floating-header.component.scss']
})
export class FloatingHeaderComponent implements OnInit {
  menuOpened: number = 0;
  shortName: string = 'NN';
  user: UserInformation = {} as any;
  currentState: string = 'Activo';

  constructor(
    private userParams: UserParametersService,
    private utilsService: UtilsService
  ) { }

  ngOnInit() {
    this.getDataUser();
  }

  openMenu(menu: number) {
    if (this.menuOpened === menu) {
      this.menuOpened = 0;
      return;
    }
    this.menuOpened = menu;
  }

  async getDataUser() {
    this.user = await this.userParams.getUserData();
    this.shortName = this.utilsService.getShortName(this.user);
  }

}
