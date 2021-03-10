import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detail-agreement',
  templateUrl: './detail-agreement.component.html',
  styleUrls: ['./detail-agreement.component.scss']
})
export class DetailAgreementComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log('redirect detalle acuerdos');
  }

}
