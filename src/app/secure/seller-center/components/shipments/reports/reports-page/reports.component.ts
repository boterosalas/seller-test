import { Component, OnInit } from '@angular/core';

// Local components
import { SearchFormEntity, InformationToForm } from '../../../../../../shared/models/order';
import { Logger } from '../../../../utils/logger.service';

/**
 * Servicio de log empleado para mostrar mensajes en consola
 */
const log = new Logger('ReportsComponent');


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})

export class ReportsComponent implements OnInit {


  // Configuración para el toolbar-options y el search de la pagina
  public informationToForm: SearchFormEntity = {
    title: 'Indicadores de mis envios',
    btn_title: 'Consultar ordenes pendientes',
    title_for_search: 'Consultar ordenes (Envios Éxito)',
    type_form: 'envios-exito',
    information: new InformationToForm
  };

  single: any[];
  multi: any[];

  view: any[] = [700, 400];

  // options
  showLegend = true;

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  // pie
  showLabels = true;
  explodeSlices = false;
  doughnut = false;

  /**
   * Creates an instance of HistoricComponent.
   * @memberof ReportsComponent
   */
  constructor() {

    Object.assign(this, { single, multi });

  }

  /**
   * @memberof ReportsComponent
   */
  ngOnInit() {
    log.info('ReportsComponent is load');
  }


  /**
  * Funcionalidad para consultar la lista de ordenes
  * @param {*} $event
  * @memberof ReportsComponent
  */
  getOrdersList($event) {
    log.info($event);
  }

  /**
  * Método para cambiar el page size de la tabla ordenes
  * @param {any} pageSize
  * @memberof ReportsComponent
  */
  changeSizeOrderTable($event) {
    log.info($event);
  }

  onSelect(event) {
    log.info(event);
  }
}


export let single = [
  {
    'name': 'Germany',
    'value': 8940000
  },
  {
    'name': 'USA',
    'value': 5000000
  },
  {
    'name': 'France',
    'value': 7200000
  }
];

export let multi = [
  {
    'name': 'Germany',
    'series': [
      {
        'name': '2010',
        'value': 7300000
      },
      {
        'name': '2011',
        'value': 8940000
      }
    ]
  },

  {
    'name': 'USA',
    'series': [
      {
        'name': '2010',
        'value': 7870000
      },
      {
        'name': '2011',
        'value': 8270000
      }
    ]
  },

  {
    'name': 'France',
    'series': [
      {
        'name': '2010',
        'value': 5000002
      },
      {
        'name': '2011',
        'value': 5800000
      }
    ]
  }
];
