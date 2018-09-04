/* 3rd party components */
import { Component, OnInit } from '@angular/core';
/* our own custom components */
import { EventEmitterSeller } from '../events/eventEmitter-seller.service';
import { StoreModel } from '@app/secure/offers/stores/models/store.model';
import { StoresService } from '@app/secure/offers/stores/stores.service';

@Component({
    selector: 'app-manage-seller',
    templateUrl: './manage-seller.component.html',
    styleUrls: ['./manage-seller.component.scss']
})
export class ManageSellerComponent implements OnInit {

    // variable que almacena el nombre de la tienda seleccionada
    public currentSellerSelect: StoreModel;
    // Información del usuario
    public user: any;

    constructor(
        public eventsSeller: EventEmitterSeller,
        public storeService: StoresService,
    ) {
        this.currentSellerSelect = new StoreModel(0, '');
        this.user = {};
    }


    ngOnInit() {
        // EventEmitter que permite saber cuando el usuario a buscado una tienda
        this.eventsSeller.eventSearchSeller.subscribe((res: StoreModel) => {
            this.currentSellerSelect = res;
        });
    }
}
