/* 3rd party components */
import {Component, Input, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';

/* our own custom components */
import {BulkLoadComponent} from '../bulk-load/bulk-load.component';

/**
 * Component que permite visualizar una lista de errores capturados del excel.
 * y permite visualizar en la tabla de tableLoadComponente el error presentado
 */
@Component({
  selector: 'app-table-errors',
  templateUrl: './table-errors.component.html',
  styleUrls: ['./table-errors.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('void', style({height: '0px', minHeight: '0', visibility: 'hidden'})),
      state('*', style({height: '*', visibility: 'visible'})),
      transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

/**
 * TableErrorsComponent
 */
export class TableErrorsComponent implements OnInit {

  // Nombre del archivo capturado
  @Input() fileName;
  // Número de registros capturados
  @Input() countRowUpload;
  // Número de errores capturados
  @Input() countErrors;
  // Lista con los registros de errores
  @Input() listLog: Array<{}>;

  /**
   * Creates an instance of TableErrorsComponent.
   * @param {BulkLoadComponent} bulkLoad
   * @memberof TableErrorsComponent
   */
  constructor(
    public bulkLoad: BulkLoadComponent
  ) {
    this.listLog = this.listLog || [];
  }

  ngOnInit(): void {
  }
}
