import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';

@Component({
  selector: 'app-advertisements',
  templateUrl: './advertisements.component.html',
  styleUrls: ['./advertisements.component.scss']
})
export class AdvertisementsComponent implements OnInit {

  constructor(
    private _dashboard: DashboardService
  ) { }

  public advertisements = [];

  ngOnInit() {
    this.listAdvertisements();
  }

  public listAdvertisements() {
    this._dashboard.getAdvertisements().subscribe(({Data}) => {
      this.advertisements = Data;
    })
  }

}
