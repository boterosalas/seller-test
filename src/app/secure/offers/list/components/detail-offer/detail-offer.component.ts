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
    ) { }

    /**
     * @method ngOnInit
     * @description Metodo que se llama mientras se inicia el componente
     * @memberof DetailOfferComponent
     */
    ngOnInit() {
    }

    /**
     * @method goToListOffers
     * @description Metodo para volver a listado de ofertas
     * @memberof DetailOfferComponent
     */
    goToListOffers() {
        this.list.viewDetailOffer = false;
        this.list.inDetail = false;
    }
}
