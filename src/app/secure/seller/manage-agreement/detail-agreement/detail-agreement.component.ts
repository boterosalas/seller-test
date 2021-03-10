import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'

@Component({
  selector: 'app-detail-agreement',
  templateUrl: './detail-agreement.component.html',
  styleUrls: ['./detail-agreement.component.scss']
})
export class DetailAgreementComponent implements OnInit {

  constructor(
    private location: Location
  ) { }

  ngOnInit() {
    console.log('redirect detalle acuerdos');
  }

  goBack(): void {
    this.location.back();
  }

}
