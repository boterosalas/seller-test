import { AfterViewInit, Component, OnInit } from '@angular/core';
import { UserParametersService } from '@app/core';
import { UserInformation } from '@app/shared';

@Component({
  selector: 'app-list-cancels-orders',
  templateUrl: './list-cancels-orders.component.html',
  styleUrls: ['./list-cancels-orders.component.scss']
})
export class ListCancelsOrdersComponent implements OnInit {

  public user: UserInformation;
  showTabs = true;

  constructor(
    public userParams: UserParametersService,

  ) { }

  ngOnInit() {
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
