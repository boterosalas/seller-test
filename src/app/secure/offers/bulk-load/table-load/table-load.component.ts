import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';

import { BulkLoadComponent } from '../bulk-load/bulk-load.component';

/**
 * Component que permite visualizar una tabla con la lista de registros con errores y el total de registros correctos
 */
@Component({
  selector: 'app-table-load',
  templateUrl: './table-load.component.html',
  styleUrls: ['./table-load.component.scss']
})

/**
 * TableLoadComponent
 */
export class TableLoadComponent implements OnInit {

  // Número de registros subidos
  @Input() countRowUpload;
  // Número de errores presentados
  @Input() countErrors;
  // Sort: elemento que se emplea para poder organizar los elementos de la tabla de acuerdo a la columna seleccionada
  @ViewChild(MatSort) sort: MatSort;
  //  Elemento paginador
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // Columnas que se visualizan en la tabla
  public displayedColumns = [
    'EAN',
    'Stock',
    'Price',
    'DiscountPrice',
    'AverageFreightCost',
    'PromiseDelivery',
    'IsFreeShipping',
    'IsEnviosExito',
    'IsFreightCalculator',
    'Warranty',
    'IsLogisticsExito',
    'IsUpdatedStock',
    'ComboQuantity',
    'EanCombo',
    'Currency'
  ];

  /**
   * Creates an instance of TableLoadComponent.
   * @param {BulkLoadComponent} bulkLoad
   * @memberof TableLoadComponent
   */
  constructor(public bulkLoad: BulkLoadComponent) {
  }

  /**
   * @memberof TableLoadComponent
   */
  ngOnInit() {
    setTimeout(res => {
      this.bulkLoad.paginator = this.paginator;
      this.bulkLoad.sort = this.sort;
      this.bulkLoad.finishProcessUpload();
    }, 100);
  }
}
