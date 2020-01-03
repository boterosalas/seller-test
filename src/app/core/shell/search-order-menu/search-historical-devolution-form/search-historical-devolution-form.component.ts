import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SearchFormEntity } from '@app/shared';
import { ShellComponent } from '../../shell.component';
import * as _ from 'lodash';
import { SearchOrderMenuService } from '../search-order-menu.service';
import { DatePipe } from '@angular/common';

interface DataForm {
  dateReversionRequestInitial?: Date | string;
  dateReversionRequestFinal?: Date | string;
  identificationCard?: string;
  orderNumber?: string;
  reversionRequestStatusId?: number;
}
@Component({
  selector: 'app-search-historical-devolution-form',
  templateUrl: './search-historical-devolution-form.component.html',
  styleUrls: ['./search-historical-devolution-form.component.scss']
})
export class SearchHistoricalDevolutionFormComponent implements OnInit {
  public form: FormGroup;
  public myform: FormGroup;

  // Configuración para el formato de fecha
  private locale = 'es-CO';

  @Input() public informationToForm: SearchFormEntity;
  @Input() idSeller: number;

  /**
   * Creates an instance of SearchHistoricalDevolutionFormComponent.
   * @param {FormBuilder} fb
   * @param {ShellComponent} shellComponent
   * @param {SearchOrderMenuService} __searchOrderMenuService
   * @memberof SearchHistoricalDevolutionFormComponent
   */
  constructor(
    private fb: FormBuilder,
    private shellComponent: ShellComponent,
    private __searchOrderMenuService: SearchOrderMenuService
  ) {}

  ngOnInit() {
    this.createForm();
  }

  /**
   * Estructura para el formulario del filtro
   *
   * @private
   * @memberof SearchHistoricalDevolutionFormComponent
   */
  private createForm() {
    this.myform = this.fb.group({
      dateReversionRequestInitial: [null, Validators.compose([])],
      dateReversionRequestFinal: [null, Validators.compose([])],
      identificationCard: [null, Validators.compose([])],
      reversionRequestStatusId: [null, Validators.compose([])],
      orderNumber: [
        null,
        Validators.compose([Validators.minLength(1), Validators.maxLength(30)])
      ]
    });
  }

  /**
   * Método para limpiar el formulario
   *
   * @memberof SearchHistoricalDevolutionFormComponent
   */
  public clearForm() {
    this.myform.reset();
    this.shellComponent.eventEmitterOrders.getClear();
    this.shellComponent.sidenavSearchOrder.toggle();
  }

  /**
   * Metodo para filtrar el historico segun los campos completados
   *
   * @param {FormGroup} myform
   * @memberof SearchHistoricalDevolutionFormComponent
   */
  public filterHistorical(myform: FormGroup) {
    const { identificationCard, orderNumber, reversionRequestStatusId }: DataForm = myform.value;
    let { dateReversionRequestInitial, dateReversionRequestFinal }: DataForm = myform.value;

    // Obtengo la información del usuario
    // this.user = this.userService.getUser();
    const datePipe = new DatePipe(this.locale);

    // aplico el formato para la fecha a emplear en la consulta
    dateReversionRequestFinal = datePipe.transform(dateReversionRequestFinal, 'yyyy/MM/dd');
    dateReversionRequestInitial = datePipe.transform(dateReversionRequestInitial, 'yyyy/MM/dd');

    let stringQuery = '';
    const objectQuery: DataForm = {};

    if (dateReversionRequestInitial !== null && dateReversionRequestInitial !== '') {
      stringQuery += `&dateReversionRequestInitial=${dateReversionRequestInitial}`;
      objectQuery.dateReversionRequestInitial = dateReversionRequestInitial;
    }

    if (dateReversionRequestFinal !== null && dateReversionRequestFinal !== '') {
      stringQuery += `&dateReversionRequestFinal=${dateReversionRequestFinal}`;
      objectQuery.dateReversionRequestFinal = dateReversionRequestFinal;
    }

    if (reversionRequestStatusId) {
      stringQuery += `&reversionRequestStatusId=${reversionRequestStatusId}`;
      objectQuery.reversionRequestStatusId = reversionRequestStatusId;
    } else {
      stringQuery += `&reversionRequestStatusId=${this.informationToForm.information.reversionRequestStatusId}`;
      objectQuery.reversionRequestStatusId = this.informationToForm.information.reversionRequestStatusId;
    }

    if (identificationCard !== null && identificationCard !== '') {
      stringQuery += `&identificationCard=${identificationCard}`;
      objectQuery.identificationCard = identificationCard;
    }

    if (orderNumber !== null && orderNumber !== '') {
      stringQuery += `&orderNumber=${orderNumber}`;
      objectQuery.orderNumber = orderNumber;
    }

    if (!_.isEmpty(objectQuery)) {
      stringQuery += `&idSeller=${this.idSeller}`;
      // Guardo el filtro aplicado por el usuario.
      this.__searchOrderMenuService.setCurrentFilterOrders(objectQuery);
      this.__searchOrderMenuService
        .getHistoricalDevolutionFilter(100, stringQuery)
        .subscribe(data => {
          if (data) {
            // indico a los elementos que esten suscriptos al evento.
            this.shellComponent.eventEmitterOrders.filterHistoricalDevolutionWithStatusResponse(data);
            this.shellComponent.sidenavSearchOrder.toggle();
          }
        });
    }
  }
}
