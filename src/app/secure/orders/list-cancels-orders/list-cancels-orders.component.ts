import { AfterViewInit, Component, OnInit } from '@angular/core';
import { UserParametersService } from '@app/core';
import { UserInformation } from '@app/shared';
import { CoreState } from '@app/store';
import { select, Store } from '@ngrx/store';

@Component({
  selector: 'app-list-cancels-orders',
  templateUrl: './list-cancels-orders.component.html',
  styleUrls: ['./list-cancels-orders.component.scss']
})
export class ListCancelsOrdersComponent implements OnInit {

  public user: UserInformation;
  showTabs = true;
  devolution: number;

  constructor(
    public userParams: UserParametersService,
    private store: Store<CoreState>
  ) { }

  ngOnInit() {
    this.getDataUser();
    this.store
      .pipe(select(state => state.notification))
      .subscribe(
        notificationState => {
          this.devolution = notificationState.unreadDevolutions;
        }
      );
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
