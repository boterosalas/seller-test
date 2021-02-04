import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Guide } from '@app/shared';

import { LoadGuidePageComponent } from '../load-guide/load-guide-page.component';


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
  // Creo el elemento que se empleara para la tabla
  public dataSourceCurrent: MatTableDataSource<Guide>;
  // Sort: elemento que se emplea para poder organizar los elementos de la tabla de acuerdo a la columna seleccionada
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  //  Elemento paginador
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  // Columnas que se visualizan en la tabla
  public displayedColumns = [
    'orderNumber',
    'sku',
    'quantity',
    'carrier',
    'tracking',
  ];

  /**
   * Creates an instance of TableLoadComponent.
   * @param {LoadGuidePageComponent} loadGuide
   * @memberof TableLoadComponent
   */
  constructor(public loadGuide: LoadGuidePageComponent) {
  }

  /**
   * @memberof TableLoadComponent
   */
  ngOnInit() {
    setTimeout(res => {
      this.loadGuide.paginator = this.paginator;
      this.loadGuide.sort = this.sort;
      this.loadGuide.finishProcessUpload();
    }, 100);
  }
}
