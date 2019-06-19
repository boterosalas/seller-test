import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Logger, UserParametersService } from '@app/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { EventEmitterStore } from '../events/eventEmitter-store.service';
import { StoreModel } from '../models/store.model';
import { StoresService } from '../stores.service';
import { UserInformation } from '@app/shared';

// log component
const log = new Logger('SearchStoreComponent');

@Component({
  selector: 'app-search-store',
  templateUrl: './search-store.component.html',
  // tslint:disable-next-line:use-host-property-decorator
  host: { 'class': 'search-content-selector' },
  styleUrls: ['./search-store.component.scss'],
})
export class SearchStoreComponent implements OnInit, OnChanges {

  // variable que almacena el texto que se obtiene del input al buscar.
  textForSearch: FormControl = new FormControl();

  // Información del usuario
  public user: UserInformation;
  // variable que almacena la lista de tiendas disponibles para buscar
  listStores = [];

  // variable que almacena los resultados obtenidos al realizar el filtro del autocomplete
  filteredOptions: Observable<string[]>;

  @Input() searchStoreInput;

  constructor(
    public eventsStore: EventEmitterStore,
    public storeService: StoresService,
    public userParams: UserParametersService) { }

  /**
   * Evento al iniciar el componente
   * @memberof SearchStoreComponent
   */
  ngOnInit() {
    this.getDataUser();
    this.filteredOptions = this.textForSearch.valueChanges
      .pipe(
        startWith(''),
        map((val: any) =>
          this.filter(val)
        )
      );
    // consulto las tiendas disponibles
    this.getAllStores();
  }

  async getDataUser() {
    this.user = await this.userParams.getUserData();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    if (changes.searchStoreInput.currentValue && changes.searchStoreInput.currentValue !== undefined &&
      changes.searchStoreInput.currentValue !== null) {
      this.viewStoreInformation(this.searchStoreInput);
    }
  }

  /**
   * Método empleado para consultar la lista de tiendas disponibles
   * @memberof SearchStoreComponent
   */
  public getAllStores() {
    this.storeService.getAllStoresFull(this.user).subscribe((res: any) => {
      if (res.status === 200) {
        const body = JSON.parse(res.body.body);
        this.listStores = body.Data;
      } else {
        this.listStores = res.message;
      }
    });
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
    if (val !== null) {
      return this.listStores.filter(option =>
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
   * @param {any} search_store
   * @memberof SearchStoreComponent
   */
  public viewStoreInformation(search_store: StoreModel) {
    localStorage.removeItem('parametersCommission');
    localStorage.setItem('searchStore', JSON.stringify(search_store));
    // llamo el eventEmitter que se emplea para notificar cuando una tienda ha sido consultada
    this.eventsStore.searchStore(search_store);
  }

}
