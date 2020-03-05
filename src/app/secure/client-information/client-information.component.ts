import {Component} from '@angular/core';
import {Input} from '@angular/core';
import { Order, Const } from '@app/shared';



/**
 * Componente para visualizar la información del cliente
 */
@Component({
  selector: 'app-client-information',
  templateUrl: './client-information.component.html',
  styleUrls: ['./client-information.component.scss']
})
export class ClientInformationComponent {

  // Input para obtener los datos de la orden
  @Input() order: Order = Const.EMPTYORDER;
  // Input para obtener los datos de la orden
  @Input() isInternational: Boolean;

  /**
   * Creates an instance of ClientInformationComponent.
   * @memberof ClientInformationComponent
   */
  constructor() {

  }
}
