import { Component, OnInit, Input } from '@angular/core';
import { ListComponent } from '../../list/list.component';

@Component({
    selector: 'app-detail-offer',
    templateUrl: './detail-offer.component.html',
    styleUrls: ['./detail-offer.component.scss']
})

export class DetailOfferComponent implements OnInit {

    @Input() dataOffer;

    constructor(
       public listOffers: ListComponent
    ) {
    }

    ngOnInit() {
    }

    goToListOffers() {
        this.listOffers.viewDetailOffer = false;
    }
}
