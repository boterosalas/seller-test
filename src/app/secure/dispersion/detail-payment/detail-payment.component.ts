import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { EventEmitterSeller } from '@app/shared/events/eventEmitter-seller.service';

@Component({
  selector: 'app-detail-payment',
  templateUrl: './detail-payment.component.html',
  styleUrls: ['./detail-payment.component.scss']
})
export class DetailPaymentComponent implements OnInit {

  @Output() sellerDataSearch = new EventEmitter();


  constructor(
    private emitterSeller: EventEmitterSeller,
  ) { }

  ngOnInit() {
    this.emitterSeller.eventSearchSeller.subscribe(data => {
      console.log('dayta: ', data);
      this.sellerDataSearch.emit(data);
    });
  }

}
