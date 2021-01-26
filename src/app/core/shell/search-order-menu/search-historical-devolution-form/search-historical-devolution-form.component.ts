import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SearchFormEntity } from '@app/shared';
import { ShellComponent } from '../../shell.component';
import * as _ from 'lodash';
import { SearchOrderMenuService } from '../search-order-menu.service';
import { DatePipe } from '@angular/common';
import { LoadingService } from '@app/core/global';

interface DataForm {
  orderDate?: Date | string;
  reversionDate?: Date | string;
  resolutionDate?: Date | string;
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
    private __loadingService: LoadingService,
    private __searchOrderMenuService: SearchOrderMenuService
  ) { }

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
      orderDate: [null, Validators.compose([])],
      reversionDate: [null, Validators.compose([])],
      resolutionDate: [null, Validators.compose([])],
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
    this.shellComponent.eventEmitterOrders.filterParams.emit();
    this.filterHistorical(this.myform);
  }

  /**
   * Metodo para filtrar el historico segun los campos completados
   *
   * @param {FormGroup} myform
   * @memberof SearchHistoricalDevolutionFormComponent
   */
  public filterHistorical(myform: FormGroup) {
    const { identificationCard, orderNumber, reversionRequestStatusId }: DataForm = myform.value;
    let { orderDate, reversionDate, resolutionDate }: DataForm = myform.value;

    // Obtengo la información del usuario
    const datePipe = new DatePipe(this.locale);

    // aplico el formato para la fecha a emplear en la consulta
    reversionDate = datePipe.transform(reversionDate, 'yyyy/MM/dd');
    orderDate = datePipe.transform(orderDate, 'yyyy/MM/dd');
    resolutionDate = datePipe.transform(resolutionDate, 'yyyy/MM/dd');

    let stringQuery = '';
    const objectQuery: DataForm = {};

    if (orderDate !== null && orderDate !== '') {
      stringQuery += `&orderDate=${orderDate}`;
      objectQuery.orderDate = orderDate;
    }

    if (reversionDate !== null && reversionDate !== '') {
      stringQuery += `&reversionDate=${reversionDate}`;
      objectQuery.reversionDate = reversionDate;
    }

    if (resolutionDate !== null && resolutionDate !== '') {
      stringQuery += `&resolutionDate=${resolutionDate}`;
      objectQuery.resolutionDate = resolutionDate;
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
      this.__searchOrderMenuService.setCurrentFilterOrders(this.myform.value);
      this.__loadingService.viewSpinner();
      this.__searchOrderMenuService.getHistoricalDevolutionFilter(`limit=${50}`, stringQuery).subscribe(data => {
          if (data) {
            this.shellComponent.eventEmitterOrders.filterParams.emit(stringQuery);
            // indico a los elementos que esten suscriptos al evento.
            this.shellComponent.eventEmitterOrders.filterHistoricalDevolutionWithStatusResponse(data);
            this.shellComponent.sidenavSearchOrder.toggle();
            this.__loadingService.closeSpinner();
          }
        });
    }
  }
}

