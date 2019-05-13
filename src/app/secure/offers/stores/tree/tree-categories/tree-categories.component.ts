import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { Logger, UserParametersService } from '@app/core';

import { EventEmitterStore } from '../../events/eventEmitter-store.service';
import { IsLoadInformationForTree, StoreModel } from '../../models/store.model';
import { StoresService } from '../../stores.service';
import { UserInformation } from '@app/shared';

// log component
const log = new Logger('TreeCategoriesComponent');

@Component({
  selector: 'app-tree-categories',
  templateUrl: './tree-categories.component.html',
  styleUrls: ['./tree-categories.component.scss']
})
export class TreeCategoriesComponent implements OnInit {
  // variable que almacena el nombre de la tienda seleccionada
  currentStoreSelect: StoreModel = new StoreModel(0, '');
  // variable empleada para saber si se obtuvo la información necesaria para el arbol correctamente
  informationForTreeIsLoad = false;
  // variable para saber si mostrar el loading
  showLoading = false;
  allSellerCategories = [];
  CONST_MARKETPLACE = 'Marketplace';
  public arbol: any;
  // Información del usuario
  public user: UserInformation;

  @Output() currentTreeOutput = new EventEmitter<any>();
  @Input() updateFunction: boolean;

  public curret_tree: any;

  constructor(
    public eventsStore: EventEmitterStore,
    public storeService: StoresService,
    public userParams: UserParametersService
  ) { }


  ngOnInit() {
    // obtengo los datos del usuario
    this.getDataUser();
    this.getAllSellerCommissionCategory();
    // EventEmitter que permite saber cuando el usuario a buscado una tienda
    this.eventsStore.eventSearchStore.subscribe((res: StoreModel) => {
      this.configTreeComponent(res);
    });
  }

  async getDataUser() {
    this.user = await this.userParams.getUserData();
  }

  /**
   * Método empleado para realizar la configuración de la carga de la información del arbol
   * @param {*} res
   * @memberof TreeCategoriesComponent
   */
  public configTreeComponent(res: any) {
    // capturo el nombre de la tienda actual
    this.currentStoreSelect = res;
    // indico que no hay información para el arbol
    this.informationForTreeIsLoad = false;
    this.showLoading = false;
    // indico a los componentes suscritos al evento que no se ha cargado información para el arbol
    const information = {
      informationForTreeIsLoad: false,
      data: {}
    };
    this.eventsStore.informationForTreeIsLoad(information);

    // Si se ha indicado una tienda, paso a consultar la comision
    if (res.Name !== '') {
      this.getSellerCommissionCategory();
    }
  }

  /**
   * Servicio empleado para obtener toda la lista de comisiones, esta información
   * es general y se llama al cargar el componente.
   * @memberof TreeCategoriesComponent
   */
  getAllSellerCommissionCategory() {
    this.allSellerCategories = [];
    this.storeService.getAllSellerCommissionCategory().subscribe((res: any) => {
      // guardo el response
      if (res.status === 200) {
        const body = JSON.parse(res.body.body);
        this.allSellerCategories = body.Data;
      } else {
        log.debug('getAllSellerCommissionCategory:' + res.message);
      }
    });
  }


  /**
   * Servicio empleado para consultar la lista de comisiones de acuerdo a una tienda
   * @memberof TreeCategoriesComponent
   */
  getSellerCommissionCategory() {
    this.showLoading = true;
    this.storeService.getSellerCommissionCategory(this.currentStoreSelect)
      .subscribe((res: any) => {
        if (res.status === 200) {
          // indico a los componentes suscritos al evento que se ha cargado información para el arbol
          const sellerCommission = JSON.parse(res.body.body);
          const information = {
            informationForTreeIsLoad: true,
            data: {
              getSellerCommissionCategory: sellerCommission.Data,
              allGetSellerCommissionCategory: this.allSellerCategories
            }
          };
          // ejecuto el evento que notifica los cambios en la información para el arbol
          // y informa que se cargo correctamente algun dato.
          this.eventsStore.informationForTreeIsLoad(information);
          this.informationForTreeIsLoad = true;
          this.showLoading = false;
          this.configTreeInformation(information);
        } else {
          log.error(res.message);
          log.error('Error consultando las comisiones por categoria.' + res.message);
        }
      });
  }

  /**
   * Método que se encarga de organizar el json para el arbol
   *
   * @memberof TreeCategoriesComponent
   */
  configTreeInformation(information: IsLoadInformationForTree) {

    let node = {};
    const listCategories = information.data.allGetSellerCommissionCategory;
    const sellerCategories = information.data.getSellerCommissionCategory;
    for (let i = 0; i < listCategories.length; i++) {
      // tslint:disable-next-line:triple-equals
      if (listCategories[i].Name === this.CONST_MARKETPLACE) {
        node = listCategories[i];
         break;
      }
    }
    const data = this.createTree(node, listCategories, sellerCategories);
    this.arbol = data;
  }


  createTree(parent: any, listCategories: any, sellerCategories: any) {

    this.obtenerRelacionesCategorias(parent, sellerCategories);
    const hijos = [];
    for (let i = 0; i < listCategories.length; i++) {
      // tslint:disable-next-line:triple-equals
      if (listCategories[i].IdParent == parent.Id) {
        hijos.push(listCategories[i]);
      }
    }

    if (hijos.length > 0) {
      for (let i = 0; i < hijos.length; i++) {
        const hijo = hijos[i];
        if (parent.nodes == null) {
          parent.nodes = [];
        }

        parent.nodes.push(hijo);
        this.createTree(hijo, listCategories, sellerCategories);
      }
    }
    return parent;
  }

  obtenerRelacionesCategorias = function (nodo: any, sellerCategories: any) {
    nodo.commission = this.buscarComision(nodo.Id, sellerCategories);
  };

  buscarComision = function (obj: any, sellerCategories: any) {
    for (let i = 0; i < sellerCategories.length; i++) {
      // tslint:disable-next-line:triple-equals
      if (sellerCategories[i].IdCategory == obj) {
        return sellerCategories[i].Commission;
      }
    }
    return 0;
  };

  receiveDataTree($event: any) {
    if ($event && $event !== undefined && $event !== null) {
      this.curret_tree = $event;
      this.currentTreeOutput.emit(this.curret_tree);
    }
  }

}
