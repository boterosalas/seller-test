/* 3rd party components */
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

/* our own custom components */
import { EventEmitterStore } from '../events/eventEmitter-store.service';
import { Subscription } from 'rxjs/Subscription';
import { StoresService } from '../stores.service';
import { StoreModel } from '../models/store.model';
import { Logger } from '../../../../utils/logger.service';
import { User } from '../../../../../../shared/models/login.model';
import { UserService } from '../../../../utils/services/common/user/user.service';
import { Callback } from '../../../../../../service/cognito.service';
import { UserParametersService } from '../../../../../../service/user-parameters.service';

// log component
const log = new Logger('SearchStoreComponent');

@Component({
  selector: 'app-search-store',
  templateUrl: './search-store.component.html',
  // tslint:disable-next-line:use-host-property-decorator
  host: { 'class': 'search-content-selector' },
  styleUrls: ['./search-store.component.scss'],
})
export class SearchStoreComponent implements OnInit, OnChanges, Callback {

  // variable que almacena el texto que se obtiene del input al buscar.
  textForSearch: FormControl = new FormControl();

  // Información del usuario
  public user: any;
  // variable que almacena la lista de tiendas disponibles para buscar
  listStores = [];

  // variable que almacena los resultados obtenidos al realizar el filtro del autocomplete
  filteredOptions: Observable<string[]>;

  @Input() searchStoreInput;

  constructor(
    public eventsStore: EventEmitterStore,
    public userService: UserService,
    public storeService: StoresService,
    public userParams: UserParametersService) {
    this.user = {};
  }

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

  ngOnChanges(changes: SimpleChanges) {
    if (changes.searchStoreInput.currentValue && changes.searchStoreInput.currentValue !== undefined &&
      changes.searchStoreInput.currentValue !== null) {
      this.viewStoreInformation(this.searchStoreInput);
    }
  }

  callback() { }

  getDataUser() {
    this.userParams.getUserData(this);
  }

  callbackWithParam(userData: any) {
    this.user = userData;
  }

  /**
   * Método empleado para consultar la lista de tiendas disponibles
   * @memberof SearchStoreComponent
   */
  public getAllStores() {
    this.storeService.getAllStores(this.user).subscribe((res: any) => {
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
        // tslint:disable-next-line:triple-equals
        if (found != undefined) {
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
