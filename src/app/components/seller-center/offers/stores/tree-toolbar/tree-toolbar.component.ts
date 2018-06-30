import { Component, OnInit } from '@angular/core';
import { EventEmitterStore } from '../events/eventEmitter-store.service';
import { StoreModel, IsLoadInformationForTree } from '../models/store.model';

@Component({
  selector: 'app-tree-toolbar',
  templateUrl: './tree-toolbar.component.html',
  styleUrls: ['./tree-toolbar.component.scss']
})
export class TreeToolbarComponent implements OnInit {

  constructor(public eventsStore: EventEmitterStore) { }

  // variable empleada para saber si se obtuvo la información necesaria para el arbol correctamente
  informationForTreeIsLoad = false;

  ngOnInit() {

    // EventEmitter que permite saber cuando el usuario a buscado una tienda y se ha cargado la información de su comision
    this.eventsStore.eventInformationForTreeIsLoad.subscribe((res: IsLoadInformationForTree) => {
      // capturo el boolean que indica si se cargo o no la información
      this.informationForTreeIsLoad = res.informationForTreeIsLoad;
    });
  }
  /**
   * Método empleado para expandir o colapsar los nodos del arbol de categorías
   * Se emplea un event que permite notificar a quien este suscrito que el usuario ha indicado expandir o colapsar los nodos
   * @param {boolean} state
   * @memberof TreeToolbarComponent
   */
  expandAllNodes(state: boolean) {
    // llamo el eventEmitter que se emplea para notificar cuando una tienda ha sido consultada
    this.eventsStore.expandAllNodes(state);
  }
}
