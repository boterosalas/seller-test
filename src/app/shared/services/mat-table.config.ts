import { MatPaginatorIntl } from '@angular/material';


/**
 * Configuración necesaria para personalizar la tabla de Angular material.
 */
export function getDutchPaginatorIntl(): MatPaginatorIntl {
  const paginatorIntl = new MatPaginatorIntl();

  paginatorIntl.itemsPerPageLabel = 'página:';
  paginatorIntl.nextPageLabel = 'Siguiente página';
  paginatorIntl.previousPageLabel = 'Página previa';
  paginatorIntl.getRangeLabel = function (page: any, pageSize: any, length: any) {
    if (length === 0 || pageSize === 0) {
      return '0 de ' + length;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    /* If the start index exceeds the list length, do not try and fix the end index to the end. */
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;
    return startIndex + 1 + ' - ' + endIndex + ' de ' + length;
  };

  return paginatorIntl;
}
