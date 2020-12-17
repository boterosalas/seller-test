import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { LoadingService } from '@app/core';
import { EventEmitterSeller } from '@app/shared/events/eventEmitter-seller.service';

@Component({
  selector: 'app-detail-payment',
  templateUrl: './detail-payment.component.html',
  styleUrls: ['./detail-payment.component.scss']
})
export class DetailPaymentComponent implements OnInit {
  sellerData: any;
  activeTabs: Boolean = false;


  constructor(
    private emitterSeller: EventEmitterSeller,
    private loadingService?: LoadingService,

  ) { }

  ngOnInit() {
    this.selectSeller();
  }

  /**
   * Metodo para seleccionar el seller y enviarlos a los tabs la info.
   * @memberof DetailPaymentComponent
   */
  selectSeller() {
    this.loadingService.viewSpinner();
    this.emitterSeller.eventSearchSeller.subscribe(data => {
      if (data) {
        this.activeTabs = true;
        this.sellerData = data;
      } else {
        this.activeTabs = false;
      }
      this.loadingService.closeSpinner();
    });
  }

}
