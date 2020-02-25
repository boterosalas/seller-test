import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogWithFormComponent } from '@app/shared/components/dialog-with-form/dialog-with-form.component';
import { TranslateService } from '@ngx-translate/core';
import { ModalQuotingSellerComponent, quotiongDialogAction } from './modal-quoting-seller/modal-quoting-seller.component';
import { LoadingService, ModalService } from '@app/core';
import { QuotingService } from '../quoting.service';

export interface PeriodicElement {
  category: string;
  transport: string;
  zone: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { category: 'Categoria', transport: 'Envío propio', zone: 'Zonoa Bogota' },
  { category: 'Categoria', transport: 'Envío propio', zone: 'Zonoa Bogota' },
  { category: 'Categoria', transport: 'Envío propio', zone: 'Zonoa Bogota' },
  { category: 'Categoria', transport: 'Envío propio', zone: 'Zonoa Bogota' },
  { category: 'Categoria', transport: 'Envío propio', zone: 'Zonoa Bogota' },
  { category: 'Categoria', transport: 'Envío propio', zone: 'Zonoa Bogota' },
  { category: 'Categoria', transport: 'Envío propio', zone: 'Zonoa Bogota' },
  { category: 'Categoria', transport: 'Envío propio', zone: 'Zonoa Bogota' },
];


@Component({
  selector: 'app-quoting-seller',
  templateUrl: './quoting-seller.component.html',
  styleUrls: ['./quoting-seller.component.scss']
})
export class QuotingSellerComponent implements OnInit {

  displayedColumns: string[] = ['category', 'transport', 'zone', 'actions'];
  dataSource = [];
  listQuotes: any;
  constructor(
    private dialog: MatDialog,
    private loadingService: LoadingService,
    private quotingService: QuotingService,
    private modalService: ModalService,
    private languageService: TranslateService,
  ) { }

  ngOnInit() {
    this.getListQuote();
  }

  /**
   * Función que abre modal con las diferentes acciones (create, update,delete)
   * @param {*} [action]
   * @param {*} [element]
   * @memberof QuotingSellerComponent
   */
  openDialog(action?: any, element?: any) {
    // const data = this.putDataForCreate();
    const dialogRef = this.dialog.open(ModalQuotingSellerComponent, {
      width: '55%',
      minWidth: '280px',
      data: {
        action: action,
        idZone: element
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('res: ', result);
      if (result) {
        this.getListQuote();
      }
    });
  }

  /**
   * Accion para crear parametizacion de cotizador
   * @memberof QuotingSellerComponent
   */
  addCategory() {
    this.openDialog(quotiongDialogAction.add);
  }

  /**
   * Accion para editar parametizacion de cotizador
   * @memberof QuotingSellerComponent
   */
  updateCategory() {
    this.openDialog(quotiongDialogAction.update);
  }

  /**
   * Accion para eliminar parametizacion de cotizador
   * @param {*} idZone
   * @memberof QuotingSellerComponent
   */
  deleteCategory(idZone: any) {
    this.openDialog(quotiongDialogAction.delete, idZone);
  }

  /**
   * Metodo para obtener todas las parametrizaciones y pintarlas
   * @memberof QuotingSellerComponent
   */
  public getListQuote(): void {
    this.loadingService.viewSpinner();
    this.quotingService.getQuotingSeller().subscribe((result: any) => {
      if (result.status === 201 || result.status === 200) {
        const body = JSON.parse(result.body.body);
        this.listQuotes = body.Data;
        this.dataSource = this.listQuotes;
        console.log(this.listQuotes);
      } else {
        this.modalService.showModal('errorService');
      }
      this.loadingService.closeSpinner();
    });
  }

}
