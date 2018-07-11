import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { ModelFilter } from '../components/filter/filter.model';
import { ShellComponent } from '../../../../shell/shell.component';

@Component({
    selector: 'app-list-component',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})

export class ListComponent implements OnInit {

    @ViewChild('sidenav') sidenav: MatSidenav;

    public viewDetailOffer = false;
    public dataOffer: any;

    public filterActive = false;

    public paramData: ModelFilter;

    public filterRemove: any;

    public listOffer: any;

    public data = [
        {
            'imageUrl': '../../../../../../assets/offers/gopro.png',
            'ean': '80337790305753A',
            'price': 1599900,
            'discountPrice': 889900,
            'name': 'Cámara deportiva go pro Hero 5 black jas asjas seks asa aakd',
            'stock': 586000,
            'updatedDate': new Date(),
            'idOffer': 123465,
            'promiseDelivery': '2 a 6',
            'shippingCost': 3000,
            'warranty': 6,
            'isFreeShipping': true,
            'isEnviosExito': false,
            'isFreightCalculator': false,
            'size': '',
            'hexColourCodePDP': ''
        },
        {
            'imageUrl': '../../../../../../assets/offers/gopro.png',
            'ean': '80337790305753A',
            'price': 1599900,
            'discountPrice': 889900,
            'name': 'Cámara deportiva go pro Hero 5 black',
            'stock': 0,
            'updatedDate': new Date(),
            'idOffer': 123465,
            'promiseDelivery': '2 a 6',
            'shippingCost': 3000,
            'warranty': 6,
            'isFreeShipping': true,
            'isEnviosExito': false,
            'isFreightCalculator': false,
            'size': '',
            'hexColourCodePDP': ''
        },
        {
            'imageUrl': '../../../../../../assets/offers/gopro.png',
            'ean': '80337790305753A',
            'price': 1599900,
            'discountPrice': 889900,
            'name': 'Cámara deportiva go pro Hero 5 black',
            'stock': 586000,
            'updatedDate': new Date(),
            'idOffer': 123465,
            'promiseDelivery': '2 a 6',
            'shippingCost': 3000,
            'warranty': 6,
            'isFreeShipping': true,
            'isEnviosExito': false,
            'isFreightCalculator': false,
            'size': '',
            'hexColourCodePDP': ''
        },
        {
            'imageUrl': '../../../../../../assets/offers/gopro.png',
            'ean': '80337790305753A',
            'price': 1599900,
            'discountPrice': 889900,
            'name': 'Cámara deportiva go pro Hero 5 black',
            'stock': 586000,
            'updatedDate': new Date(),
            'idOffer': 123465,
            'promiseDelivery': '2 a 6',
            'shippingCost': 3000,
            'warranty': 6,
            'isFreeShipping': true,
            'isEnviosExito': false,
            'isFreightCalculator': false,
            'size': '',
            'hexColourCodePDP': ''
        },
        {
            'imageUrl': '../../../../../../assets/offers/gopro.png',
            'ean': '80337790305753A',
            'price': 1599900,
            'discountPrice': 889900,
            'name': 'Cámara deportiva go pro Hero 5 black',
            'stock': 0,
            'updatedDate': new Date(),
            'idOffer': 123465,
            'promiseDelivery': '2 a 6',
            'shippingCost': 3000,
            'warranty': 6,
            'isFreeShipping': true,
            'isEnviosExito': false,
            'isFreightCalculator': false,
            'size': '',
            'hexColourCodePDP': ''
        },
        {
            'imageUrl': '../../../../../../assets/offers/gopro.png',
            'ean': '80337790305753A',
            'price': 1599900,
            'discountPrice': 889900,
            'name': 'Cámara deportiva go pro Hero 5 black',
            'stock': 586000,
            'updatedDate': new Date(),
            'idOffer': 123465,
            'promiseDelivery': '2 a 6',
            'shippingCost': 3000,
            'warranty': 6,
            'isFreeShipping': true,
            'isEnviosExito': false,
            'isFreightCalculator': false,
            'size': '',
            'hexColourCodePDP': ''
        },
        {
            'imageUrl': '../../../../../../assets/offers/gopro.png',
            'ean': '80337790305753A',
            'price': 1599900,
            'discountPrice': 889900,
            'name': 'Cámara deportiva go pro Hero 5 black',
            'stock': 586000,
            'updatedDate': new Date(),
            'idOffer': 123465,
            'promiseDelivery': '2 a 6',
            'shippingCost': 3000,
            'warranty': 6,
            'isFreeShipping': true,
            'isEnviosExito': false,
            'isFreightCalculator': false,
            'size': '',
            'hexColourCodePDP': ''
        },
        {
            'imageUrl': '../../../../../../assets/offers/gopro.png',
            'ean': '80337790305753A',
            'price': 1599900,
            'discountPrice': 889900,
            'name': 'Cámara deportiva go pro Hero 5 black',
            'stock': 0,
            'updatedDate': new Date(),
            'idOffer': 123465,
            'promiseDelivery': '2 a 6',
            'shippingCost': 3000,
            'warranty': 6,
            'isFreeShipping': true,
            'isEnviosExito': false,
            'isFreightCalculator': false,
            'size': '',
            'hexColourCodePDP': ''
        },
        {
            'imageUrl': '../../../../../../assets/offers/gopro.png',
            'ean': '80337790305753A',
            'price': 1599900,
            'discountPrice': 889900,
            'name': 'Cámara deportiva go pro Hero 5 black',
            'stock': 586000,
            'updatedDate': new Date(),
            'idOffer': 123465,
            'promiseDelivery': '2 a 6',
            'shippingCost': 3000,
            'warranty': 6,
            'isFreeShipping': true,
            'isEnviosExito': false,
            'isFreightCalculator': false,
            'size': '',
            'hexColourCodePDP': ''
        },
        {
            'imageUrl': '../../../../../../assets/offers/gopro.png',
            'ean': '80337790305753A',
            'price': 1599900,
            'discountPrice': 889900,
            'name': 'Cámara deportiva go pro Hero 5 black',
            'stock': 0,
            'updatedDate': new Date(),
            'idOffer': 123465,
            'promiseDelivery': '2 a 6',
            'shippingCost': 3000,
            'warranty': 6,
            'isFreeShipping': true,
            'isEnviosExito': false,
            'isFreightCalculator': false,
            'size': '',
            'hexColourCodePDP': ''
        },
    ];

    constructor(public shellComponent: ShellComponent) {
        this.paramData = new ModelFilter();
    }

    ngOnInit() {
        this.getListOffers();
    }

    /**
     * @method openDetailOffer()
     * @param item
     * @memberof ListComponent
     * @description Metodo para ver el detalle de la oferta si no esta agotada
     */
    openDetailOffer(item) {
        this.viewDetailOffer = true;
        this.dataOffer = item;

    }

    /**
     * @method filterOffers
     * @param params
     * @memberof ListComponent
     * @description Metodo para filtrar el listado de ofertas
     */
    filterOffers(params) {
        this.filterActive = true;
        this.paramData.product = params.product;
        this.paramData.ean = params.ean;
        this.paramData.stock = params.stock === '1' ? 'Con inventario' : params.stock === '0' ? 'Agotado' : undefined;
        this.sidenav.toggle();
    }

    /**
     * @method removeFilter
     * @param filter
     * @memberof ListComponent
     * @description Metodo para remover filtros
     */
    removeFilter(filter) {
        switch (filter) {
            case 'filterProduct':
                this.paramData.product = undefined;
                break;
            case 'filterEan':
                this.paramData.ean = undefined;
                break;
            case 'filterStock':
                this.paramData.stock = undefined;
                break;
        }
        this.filterRemove = filter;
        if (this.paramData.product === undefined && this.paramData.ean === undefined && this.paramData.stock === undefined) {
            this.filterActive = false;
            this.getListOffers();
        }
    }

    /**
     * @method getListOffers
     * @memberof ListComponent
     * @description Metodo para consumir el servicio de listado de ofertas
     */
    getListOffers() {
        this.listOffer = 'Consultando listado de ofertas';
        console.log(this.listOffer);
    }
}
