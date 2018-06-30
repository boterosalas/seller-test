/* 3rd party components */
import {Component} from '@angular/core';
import {Input} from '@angular/core';

/* our own custom components */
import {Order} from '../../shared/models/order';
import {Const} from '../../shared/util/constants';

/**
 * Component
 */
@Component({
  selector: 'app-client-information',
  templateUrl: './client-information.component.html',
  styleUrls: ['./client-information.component.scss']
})

/**
 * Componente para visualizar la información del cliente
 */
export class ClientInformationComponent {

  // Input para obtener los datos de la orden
  @Input() order: Order = Const.EMPTYORDER;

  /**
   * Creates an instance of ClientInformationComponent.
   * @memberof ClientInformationComponent
   */
  constructor() {

  }
}
