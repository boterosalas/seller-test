import { Component, OnInit } from '@angular/core';
import { SearchFormEntity, InformationToForm } from '@app/shared';
import { Subscription } from 'rxjs';
import { HttpEvent } from '@angular/common/http';

@Component({
  selector: 'app-bulk-load-billing',
  templateUrl: './bulk-load-billing.component.html',
  styleUrls: ['./bulk-load-billing.component.scss']
})
export class BulkLoadBillingComponent implements OnInit {


  accept = '*';
  files: File[] = [];
  progress: number;
  hasBaseDropZoneOver = false;
  httpEmitter: Subscription;
  httpEvent: HttpEvent<Event>;
  lastFileAt: Date;
  maxSize = 3145728;
  lastInvalids: any;
  dataToSend: any;
  showProgress = false;
  validComboDrag = true;
  dragFiles = true;
  file = null;

  public informationToForm: SearchFormEntity = {
    title: 'secure.orders.orders',
    subtitle: 'menu.Carga masiva de Facturas',
    btn_title: 'secure.billing.summaryPayment.search_summaryPayment',
    title_for_search: 'secure.billing.summaryPayment.search_summaryPayment',
    type_form: 'bulkLoadBillingOrders',
    information: new InformationToForm,
    count: null
  };
  constructor() { }

  ngOnInit() {
  }

}
