/* 3rd party components */
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

/* our own custom components */
import { StoresService } from '@app/secure/offers/stores/stores.service';
import { StoreModel } from '@app/secure/offers/stores/models/store.model';
import { ShellComponent } from '@app/core/shell/shell.component';
import { LoadingService } from '@app/core';
import { EventEmitterSeller } from '@app/shared/events/eventEmitter-seller.service';

@Component({
    selector: 'app-search-seller',
    templateUrl: './search-seller.component.html',
    styleUrls: ['./search-seller.component.scss'],
})
export class SearchSellerComponent implements OnInit, OnChanges {

    // variable que almacena el texto que se obtiene del input al buscar.
    public textForSearch: FormControl;

    // Información del usuario
    public user: any;
    // variable que almacena la lista de tiendas disponibles para buscar
    public listSellers: any;

    // variable que almacena los resultados obtenidos al realizar el filtro del autocomplete
    public filteredOptions: Observable<string[]>;

    @Input() searchSellerInput;

    // Para identificar qué tipo de búsqueda se va a realizar.
    @Input() isFullSearch: boolean;

    constructor(
        public eventsSeller: EventEmitterSeller,
        public storeService: StoresService,
        public shell: ShellComponent,
        private loadingService: LoadingService
    ) {
        this.textForSearch = new FormControl();
        this.user = {};
        this.listSellers = [];
        this.isFullSearch = true;
    }

    /**
     * Evento al iniciar el componente
     * @memberof SearchStoreComponent
     */
    ngOnInit() {
        this.filteredOptions = this.textForSearch.valueChanges
            .pipe(
                startWith(''),
                map((val: any) =>
                    this.filter(val)
                )
            );
        // consulto las tiendas disponibles
        this.getAllSellers();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.searchSellerInput && changes.searchSellerInput.currentValue && changes.searchSellerInput.currentValue !== undefined &&
            changes.searchSellerInput.currentValue !== null) {
            this.viewStoreInformation(this.searchSellerInput);
        }
    }

    /**
     * Método empleado para consultar la lista de tiendas disponibles
     * @memberof SearchStoreComponent
     */
    public getAllSellers() {
        this.loadingService.viewSpinner();
        if (this.isFullSearch) {
            this.storeService.getAllStoresFull(this.user).subscribe((res: any) => {
                if (res.status === 200) {
                    const body = JSON.parse(res.body.body);
                    this.listSellers = body.Data;
                } else {
                    this.listSellers = res.message;
                }
                this.loadingService.closeSpinner();
            });
        } else {
            this.storeService.getAllStores(this.user).subscribe((res: any) => {
                if (res.status === 200) {
                    const body = JSON.parse(res.body.body);
                    this.listSellers = body.Data;
                } else {
                    this.listSellers = res.message;
                }
                this.loadingService.closeSpinner();
            });
        }
    }

    /**
     * Evento que permite escuchar los cambios en el input de busqueda para saber si no hay un valor ingresado y setear el campo
     * @param {any} event
     * @memberof SearchStoreComponent
     */
    public whatchValueInput(event: any): void {
        if (event === '') {
            this.textForSearch.reset();
        }
    }

    /**
     * Método que retorna el resultado dentro del array de tiendas disponible
     * @param {string} val
     * @returns {string[]}
     * @memberof SearchStoreComponent
     */
    public filter(val: string): string[] {
        if (val !== null && this.listSellers)  {
            return this.listSellers.filter(option =>
                option.Name.toLowerCase().includes(val.toLowerCase()));
        }
    }

    /**
     * Evento que permite capturar cuando un usuario presiona enter al estar en el input,
     * Este evento se agrega para poder obtener el primer resultado que se encuentre en la lista al momento de presionar enter
     * @param {any} event
     * @memberof SearchStoreComponent
     */
    public keyDownFunction(event: any): void {
        // keyCode 13 -> Enter
        if (event.keyCode === 13) {
            // Obtengo los ultimos registros almacenados sobre la lista de busqueda
            const suscribe = this.filteredOptions.subscribe((res: any) => {
                // busco dentro de los registro el que conincida con el cricterio de busqueda actual
                const found = res.find((x: StoreModel) => x.Name === this.textForSearch.value);
                // si hay algun resultado de busqueda, paso a visualizar la información de la tienda
                if (found !== undefined) {
                    this.viewStoreInformation(found);
                }
            });
            suscribe.unsubscribe();
        }
    }

    /**
     * Método que se encarga de ejecutar el event que le indica a los componentes que esten escuchando cualquier cambio
     * En la busqueda de tiendas
     * @param {any} search_seller
     * @memberof SearchStoreComponent
     */
    public viewStoreInformation(search_seller: StoreModel) {
        // llamo el eventEmitter que se emplea para notificar cuando una tienda ha sido consultada
        this.eventsSeller.searchSeller(search_seller);
    }

}
