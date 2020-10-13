import { AfterViewInit, Component, OnInit } from '@angular/core';
import { UserParametersService } from '@app/core';
import { UserInformation } from '@app/shared';

@Component({
  selector: 'app-list-cancels-orders',
  templateUrl: './list-cancels-orders.component.html',
  styleUrls: ['./list-cancels-orders.component.scss']
})
export class ListCancelsOrdersComponent implements OnInit, AfterViewInit {

  public user: UserInformation;
  showTabs = true;
  
  constructor(
    public userParams: UserParametersService,

  ) { }

  ngOnInit() {
  }

  /**
   * Metodo para organizar posicion de los filtros.
   * @memberof ListCancelsOrdersComponent
   */
  ngAfterViewInit() {
    const principalToolbar = document.getElementsByClassName('mat-tab-label');
    principalToolbar[0].classList.add('mat-tab-label-size');
    principalToolbar[1].classList.add('mat-tab-label-size');
  }

  async getDataUser() {
    this.user = await this.userParams.getUserData();
    if (this.user.sellerProfile === 'seller') {
      this.showTabs = true;
    } else {
      this.showTabs = false;
    }
  }

}
