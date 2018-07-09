/* 3rd party components */
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

/* our own custom components */
import { Logger } from '../../../../../core/utilities/logger.service';
import { EventEmitterStore } from '../events/eventEmitter-store.service';
import { Subscription } from 'rxjs/Subscription';
import { StoresService } from '../stores.service';
import { User } from '../../../../shared/models/login.model';
import { UserService } from '../../../../../core/services/common/user/user.service';
import { StoreModel } from '../models/store.model';

// log component
const log = new Logger('SearchStoreComponent');

@Component({
  selector: 'app-search-store',
  templateUrl: './search-store.component.html',
  // tslint:disable-next-line:use-host-property-decorator
  host: { 'class': 'search-content-selector' },
  styleUrls: ['./search-store.component.scss'],
})
export class SearchStoreComponent implements OnInit {

  // variable que almacena el texto que se obtiene del input al buscar.
  textForSearch: FormControl = new FormControl();

  // Información del usuario
  public user: User;
  // variable que almacena la lista de tiendas disponibles para buscar
  listStores = [];

  // variable que almacena los resultados obtenidos al realizar el filtro del autocomplete
  filteredOptions: Observable<string[]>;

  constructor(
    public eventsStore: EventEmitterStore,
    public userService: UserService,
    public storeService: StoresService) { }

  /**
   * Evento al iniciar el componente
   * @memberof SearchStoreComponent
   */
  ngOnInit() {
    this.getDataUser();
    // Creación de método que escucha los cambios en el input
    // y se encarga de filtrar la busqueda sobre la lista de tiendas disponibles
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

  /**
   * Funcionalidad encargada de traer la información del usuario que se encuentra almacenada en localstorage.
   * @memberof BillingComponent
   */
  getDataUser() {
    this.user = this.userService.getUser();
    if (this.user.login === undefined) {
      this.userService.setUser([]);
    }
  }

  /**
   * Método empleado para consultar la lista de tiendas disponibles
   * @memberof SearchStoreComponent
   */
  public getAllStores() {
    this.storeService.getAllStores(this.user).subscribe((res: any) => {
      log.info(res);
      if(res.status === 200) {
        this.listStores = res.body.Data;
      }
      else {
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
        } else {
          // si no hay resultados, mando un vacio que indica que no hay resultados de busqueda.
          this.viewStoreInformation({ Name: '', IdSeller: 0 });
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
    // llamo el eventEmitter que se emplea para notificar cuando una tienda ha sido consultada
    this.eventsStore.searchStore(search_store);
  }

}
