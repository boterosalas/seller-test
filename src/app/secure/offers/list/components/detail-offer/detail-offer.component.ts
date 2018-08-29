/* 3rd party components */
import { Component, Input } from '@angular/core';
/* our own custom components */
import { ListComponent } from '../../list/list.component';

/**
 *
 * @export
 * @class DetailOfferComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-detail-offer',
    templateUrl: './detail-offer.component.html',
    styleUrls: ['./detail-offer.component.scss']
})

export class DetailOfferComponent {
    /**
     * Variable en la que almacena los datos de la oferta de la cual se quiere ver el detalle
     * @memberof DetailOfferComponent
     */
    @Input() dataOffer;

    /**
     *Creates an instance of DetailOfferComponent.
     * @param {ListComponent} list
     * @memberof DetailOfferComponent
     */
    constructor(
        public list: ListComponent
    ) { }

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
