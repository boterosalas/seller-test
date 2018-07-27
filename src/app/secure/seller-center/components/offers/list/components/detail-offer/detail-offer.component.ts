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
       public list: ListComponent
    ) {
    }

    ngOnInit() {
    }

    goToListOffers() {
        this.list.viewDetailOffer = false;
        this.list.inDetail = false;
    }
}
