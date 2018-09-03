/* 3rd party components */
import { Component, OnInit } from '@angular/core';
/* our own custom components */
import { EventEmitterSeller } from '../events/eventEmitter-seller.service';
import {
    UserService,
    Callback,
    UserParametersService
} from '@app/shared';
import { StoreModel } from '@app/secure/offers/stores/models/store.model';
import { StoresService } from '@app/secure/offers/stores/stores.service';

@Component({
    selector: 'app-manage-seller',
    templateUrl: './manage-seller.component.html',
    styleUrls: ['./manage-seller.component.scss']
})
export class ManageSellerComponent implements OnInit, Callback {

    // variable que almacena el nombre de la tienda seleccionada
    public currentStoreSelect: StoreModel;
    // Información del usuario
    public user: any;

    constructor(
        public eventsSeller: EventEmitterSeller,
        public userService: UserService,
        public storeService: StoresService,
        public userParams: UserParametersService
    ) {
        this.currentStoreSelect = new StoreModel(0, '');
        this.user = {};
    }


    ngOnInit() {
        // obtengo los datos del usuario
        this.getDataUser();
        // EventEmitter que permite saber cuando el usuario a buscado una tienda
        this.eventsSeller.eventSearchSeller.subscribe((res: StoreModel) => {
            this.currentStoreSelect = res;
        });
    }

    callback() { }

    getDataUser() {
        this.userParams.getUserData(this);
    }

    callbackWithParam(userData: any) {
        this.user = userData;
    }
}
