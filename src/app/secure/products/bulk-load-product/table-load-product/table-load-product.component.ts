import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';

import { BulkLoadProductComponent } from '../bulk-load-product/bulk-load-product.component';

/**
 * Component que permite visualizar una tabla con la lista de registros con errores y el total de registros correctos
 */
@Component({
  selector: 'app-table-load-product',
  templateUrl: './table-load-product.component.html',
  styleUrls: ['./table-load-product.component.scss']
})

/**
 * TableLoadProductComponent
 */
export class TableLoadProductComponent implements OnInit {

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
    'Warranty'
  ];

  /**
   * Creates an instance of TableLoadProductComponent.
   * @param {BulkLoadProductComponent} bulkLoad
   * @memberof TableLoadProductComponent
   */
  constructor(public bulkLoad: BulkLoadProductComponent) {
  }

  /**
   * @memberof TableLoadProductComponent
   */
  ngOnInit() {
    setTimeout(res => {
      this.bulkLoad.paginator = this.paginator;
      this.bulkLoad.sort = this.sort;
      this.bulkLoad.finishProcessUpload();
    }, 100);
  }
}
