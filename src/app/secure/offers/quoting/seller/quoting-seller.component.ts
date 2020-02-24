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
  }

  addCategory() {
    this.openDialog(quotiongDialogAction.add);
  }

  updateCategory() {
    this.openDialog(quotiongDialogAction.update);
  }

  deleteCategory(idZone: any) {
    this.openDialog(quotiongDialogAction.delete , idZone);
  }

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

  /**
   * Metodo para eliminar las parametrizaciones de cotizador
   * @param {number} idQuote
   * @memberof QuotingSellerComponent
   */
  // public deleteIdQuote(idQuote: number): void {
  //   this.loadingService.viewSpinner();
  //   this.quotingService.deleteQuotingSeller(idQuote)
  //     .subscribe(
  //       (result: any) => {
  //         if (result.statusCode === 201 || result.statusCode === 200) {
  //           this.getListQuote();
  //           this.loadingService.closeSpinner();
  //         } else {
  //           this.modalService.showModal('error');
  //         }
  //       }
  //     );
  // }
}
