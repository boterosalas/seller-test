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
  public page1 = true;
  public page2 = false;


  ngOnInit() {
    this.listAdvertisements();
  }

  public listAdvertisements() {
    this._dashboard.getAdvertisements().subscribe(({Data}) => {
      this.advertisements = Data;
    })
  }

  public showPage2() {
    this.page1 = false;
    this.page2 = true;
  }

  public showPage1() {
    this.page1 = true;
    this.page2 = false;
  }

}
