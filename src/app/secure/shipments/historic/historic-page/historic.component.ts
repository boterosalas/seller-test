import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MatTableDataSource } from '@angular/material';
import { Logger } from '@app/core';
import { InformationToForm, SearchFormEntity, Shipment } from '@app/shared';

import { ShipmentsService } from '../../shipments.service';

/**
 * Servicio de log empleado para mostrar mensajes en consola
 */
const log = new Logger('DispatchedComponent');

@Component({
  selector: 'app-historic',
  templateUrl: './historic.component.html',
  styleUrls: ['./historic.component.scss']
})

/**
 * @property ShipmentsService service
 * @property ActivatedRoute service
 */
export class HistoricComponent implements OnInit, OnDestroy {
  public displayedColumns = ['order', 'created_at', 'time_limit', 'remain', 'destination', 'state_id', 'service.carrier', 'actions'];

  public dataSource = new MatTableDataSource(ELEMENT_DATA);

  public id: number;

  public subStateOrder: any;

  // Configuración para el toolbar-options y el search de la pagina
  public informationToForm: SearchFormEntity = {
    title: 'Despacho',
    btn_title: 'Consultar órdenes pendientes',
    title_for_search: 'Consultar órdenes (Envios Éxito)',
    type_form: 'envios-exito',
    information: new InformationToForm
  };

  /**
   * Creates an instance of HistoricComponent.
   */
  constructor(private service: ShipmentsService,
    private route: ActivatedRoute,
    private router: Router) { }

  /**
   * @memberof HistoricComponent
   */
  ngOnInit() {

  }

  /**
   * destroy component
   */
  ngOnDestroy() {
    if (this.subStateOrder !== undefined) {
      this.subStateOrder.unsubscribe();
    }
  }

  /**
  * Funcionalidad para consultar la lista de órdenes
  * @param {*} $event
  */
  getShipments($event) {

  }

  /**
  * Método para cambiar el page size de la tabla órdenes
  * @param {any} pageSize
  * @memberof HistoricComponent
  */
  changeSizeOrderTable($event) {

  }

  getOrdersList($event) {

  }
}

const ELEMENT_DATA: Shipment[] = [
  {
    'created_at': '2018-03-04 22:32:45+00',
    'id': 6889,
    'order': '694401474',
    'tracking': '73810003194',
    'address_to': {
      'city': {
        'id': 17174000,
        'code': 109,
        'name': 'CHINCHINÁ',
        'department': {
          'id': '17',
          'code': 0,
          'name': 'CALDAS'
        }
      },
      'name': 'Mabel Correa galarza',
      'email': 'mabelsofia054@hotmail.com',
      'phone': '321726004',
      'address': 'Calle 12 bis# 10a15 la playita, CHINCHINA, CALDAS, Colombia',
      'address2': '',
      'comments': '',
      'zip_code': '',
      'identification': '1054987173'
    },
    'address_from': {
      'city': {
        'id': 76001000,
        'code': 3,
        'name': 'SANTIAGO DE CALI',
        'department': {
          'id': '76',
          'code': 0,
          'name': 'VALLE DEL CAUCA'
        }
      },
      'name': 'Caray-exito',
      'email': 'mercadeocol@gmail.com',
      'phone': '(312)858-9822',
      'address': 'Cra 24 A # 6-75',
      'address2': '',
      'comments': '',
      'zip_code': '',
      'identification': '722619051'
    },
    'packages': [
      {
        'id': 26054,
        'count': 1,
        'width': 22,
        'height': 8,
        'length': 32,
        'weight': 1.29,
        'created_at': '2018-03-04 22:07:20+00',
        'description': 'Saco De Boxeo Profesional Mediano  Caray Rosado - 1009',
        'declared_price': 80000
      }
    ],
    'state_id': 0,
    'time_limit': '2018-03-13 00:00:00+00',
    'pickup': null,
    'url': '/api/tracking/73810003194/pdf',
    'label': '/api/tracking/73810003194/label',
    'remain': {
      'days': -14,
      'hours': -23,
      'minutes': -20
    },
    'service': {
      'id': 4,
      'title': 'Mercancía',
      'description': 'Envio destándar de documentos y paquetes desde 5KG de peso volumétrico',
      'type': 1,
      'min_weight': 0.1,
      'max_weight': 999999.9,
      'carrier': {
        'id': 2,
        'name': 'COORDINADORA',
        'picture': 'https://envios.exito.com/static/transportadoras/coordinadora.svg',
        'conversion': 0.0004
      }
    },
    'state': {
      'id': 0,
      'name': 'IMPRESO',
      'step': 1
    }
  },
  {
    'created_at': '2018-03-12 00:47:29+00',
    'id': 8345,
    'order': '694531576',
    'tracking': '014987847819',
    'address_to': {
      'city': {
        'id': 8758000,
        'code': 403,
        'name': 'SOLEDAD',
        'department': null
      },
      'name': 'OLGA LUCIA ROJAS VASQUEZ',
      'email': 'erikaandrearuarojas@hotmail.com',
      'phone': '3003189932',
      'address': 'CALLE 83B N 12-22 LOS ALMENDROS III ETAPA SOLEDAD, SOLEDAD, ATLANTICO, Colombia',
      'address2': '',
      'comments': '',
      'zip_code': '',
      'identification': '1140869612'
    },
    'address_from': {
      'city': {
        'id': 11001000,
        'code': 904,
        'name': 'BOGOTÁ, D.C.',
        'department': {
          'id': '11',
          'code': 0,
          'name': 'BOGOTÁ, D.C.'
        }
      },
      'name': 'Propipromo-Exito',
      'email': 'info@propipromo.com',
      'phone': '3174021060',
      'address': 'AV calle 24  N 74-55 oficina 302',
      'address2': '',
      'comments': '',
      'zip_code': '',
      'identification': '9008245201'
    },
    'packages': [
      {
        'id': 31205,
        'count': 1,
        'width': 10,
        'height': 4,
        'length': 10,
        'weight': 0.5,
        'created_at': '2018-03-12 00:22:45+00',
        'description': 'Reloj Lenovo Hw01 Ritmo Cardíaco y redes sociales Bluetooth - Lenovo Hw01',
        'declared_price': 169000
      }
    ],
    'state_id': 0,
    'time_limit': '2018-03-22 00:00:00+00',
    'pickup': null,
    'url': '/api/tracking/014987847819/pdf',
    'label': '/api/tracking/014987847819/label',
    'remain': {
      'days': -5,
      'hours': -23,
      'minutes': -20
    },
    'service': {
      'id': 3,
      'title': 'Estandar paqueteria',
      'description': 'Mensajeria estandar de documento y paquetes sin límites',
      'type': 1,
      'min_weight': 0.1,
      'max_weight': 999999.99,
      'carrier': {
        'id': 1,
        'name': 'ENVIA',
        'picture': 'https://envios.exito.com/static/transportadoras/envia.svg',
        'conversion': 0.0004
      }
    },
    'state': {
      'id': 0,
      'name': 'IMPRESO',
      'step': 1
    }
  },
  {
    'created_at': '2018-03-18 04:47:27+00',
    'id': 9368,
    'order': '694402819',
    'tracking': '73810004418',
    'address_to': {
      'city': {
        'id': 5001000,
        'code': 5001,
        'name': 'MEDELLÍN',
        'department': null
      },
      'name': 'Blanca Dolly Cardona Mejía',
      'email': 'dollycardonam@une.net.co',
      'phone': '3108308094',
      'address': 'Carrera 32 # 43 - 32, Barrio La Milagrosa, MEDELLIN, ANTIOQUIA, Colombia',
      'address2': '',
      'comments': '',
      'zip_code': '',
      'identification': '43066204'
    },
    'address_from': {
      'city': {
        'id': 11001000,
        'code': 904,
        'name': 'BOGOTÁ, D.C.',
        'department': {
          'id': '11',
          'code': 0,
          'name': 'BOGOTÁ, D.C.'
        }
      },
      'name': 'INVERSIONES MARIN-Exito',
      'email': 'alvaro.marin.caro@gmail.com',
      'phone': '(319)2553030',
      'address': 'Carrera 20 # 10-37 San Jose',
      'address2': '',
      'comments': '',
      'zip_code': '',
      'identification': '722547221'
    },
    'packages': [
      {
        'id': 35012,
        'count': 1,
        'width': 10,
        'height': 16,
        'length': 10,
        'weight': 3,
        'created_at': '2018-03-18 04:21:17+00',
        'description': 'Perfume Beverly Hills Red 90Ml Mujer -  TG-PER-BEV-HIL-RED-90-MUJ',
        'declared_price': 121900
      }
    ],
    'state_id': 0,
    'time_limit': '2018-03-26 00:00:00+00',
    'pickup': '2018-03-26 14:01:09+00',
    'url': '/api/tracking/73810004418/pdf',
    'label': '/api/tracking/73810004418/label',
    'remain': {
      'days': -1,
      'hours': -23,
      'minutes': -20
    },
    'service': {
      'id': 4,
      'title': 'Mercancía',
      'description': 'Envio destándar de documentos y paquetes desde 5KG de peso volumétrico',
      'type': 1,
      'min_weight': 0.1,
      'max_weight': 999999.9,
      'carrier': {
        'id': 2,
        'name': 'COORDINADORA',
        'picture': 'https://envios.exito.com/static/transportadoras/coordinadora.svg',
        'conversion': 0.0004
      }
    },
    'state': {
      'id': 0,
      'name': 'IMPRESO',
      'step': 1
    }
  }
];
