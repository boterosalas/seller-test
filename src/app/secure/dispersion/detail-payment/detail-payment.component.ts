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
  // @Input() sellerData: any;


  constructor(
    private emitterSeller: EventEmitterSeller,
    private loadingService?: LoadingService,

  ) { }

  ngOnInit() {
    this.selectSeller();
    // this.loadingService.viewSpinner(); // Mostrar el spinner
    // this.emitterSeller.eventSearchSeller.subscribe(data => {
    //   this.sellerData = data;
    //   this.loadingService.viewSpinner(); // Mostrar el spinner
    // });
  }

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
