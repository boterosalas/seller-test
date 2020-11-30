import { Component, OnInit } from '@angular/core';
import { InformationToForm, SearchFormEntity } from '@app/shared';

@Component({
  selector: 'app-payment-summary',
  templateUrl: './payment-summary.component.html',
  styleUrls: ['./payment-summary.component.scss']
})
export class PaymentSummaryComponent implements OnInit {

  public informationToForm: SearchFormEntity = {
    title: 'module.Dispersion',
    subtitle: 'menu.Resumen de pagos',
    btn_title: 'dispersión',
    title_for_search: 'Filtros',
    type_form: 'module',
    information: new InformationToForm,
    count: null
  };
  public btnFilter = true;


  constructor() { }

  ngOnInit() {
  }

}
