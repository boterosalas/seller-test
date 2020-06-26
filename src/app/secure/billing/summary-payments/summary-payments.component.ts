import { Component, OnInit, ViewChild } from '@angular/core';
import { SearchFormEntity, InformationToForm } from '@app/shared';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'app-summary-payments',
  templateUrl: './summary-payments.component.html',
  styleUrls: ['./summary-payments.component.scss']
})
export class SummaryPaymentsComponent implements OnInit {

  public stateSideNavOrder = false;

  public displayedColumns = [
    'check',
    'number_bill',
    'quantity_orders',
    'payment_date',
    'total_discounted_value',
    'total_to_pay'
  ];

   // Configuración para el toolbar-options y el search de la pagina
   public informationToForm: SearchFormEntity = {
    title: 'module.Facturación',
    subtitle: 'menu.Resumen de Pagos',
    btn_title: 'secure.orders.filter.title',
    title_for_search: 'secure.orders.filter.title',
    type_form: 'summaryPayment',
    information: new InformationToForm,
    count: null
  };

  constructor() { }

  ngOnInit() {
  }

  toggleFilter() {
    this.stateSideNavOrder = !this.stateSideNavOrder;
    // this.sidenavSearchOrder.toggle();
  }

}
