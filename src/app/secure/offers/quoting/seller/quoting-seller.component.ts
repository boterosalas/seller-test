import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogWithFormComponent } from '@app/shared/components/dialog-with-form/dialog-with-form.component';
import { TranslateService } from '@ngx-translate/core';

export interface PeriodicElement {
  category: string;
  transport: string;
  zone: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {category: 'Categoria', transport: 'Envío propio', zone: 'Zonoa Bogota'},
  {category: 'Categoria', transport: 'Envío propio', zone: 'Zonoa Bogota'},
  {category: 'Categoria', transport: 'Envío propio', zone: 'Zonoa Bogota'},
  {category: 'Categoria', transport: 'Envío propio', zone: 'Zonoa Bogota'},
  {category: 'Categoria', transport: 'Envío propio', zone: 'Zonoa Bogota'},
  {category: 'Categoria', transport: 'Envío propio', zone: 'Zonoa Bogota'},
  {category: 'Categoria', transport: 'Envío propio', zone: 'Zonoa Bogota'},
  {category: 'Categoria', transport: 'Envío propio', zone: 'Zonoa Bogota'},
];


@Component({
  selector: 'app-quoting-seller',
  templateUrl: './quoting-seller.component.html',
  styleUrls: ['./quoting-seller.component.scss']
})
export class QuotingSellerComponent implements OnInit {

  displayedColumns: string[] = ['category', 'transport', 'zone', 'actions'];
  dataSource = ELEMENT_DATA;
  constructor(
    private dialog: MatDialog,
    private languageService: TranslateService,
  ) { }

  ngOnInit(): void { }

  openDialog(action?: string, element?: any) {
    const data = this.putDataForCreate();
    const dialogRef = this.dialog.open(DialogWithFormComponent, {
      data: data,
      width: '55%',
      minWidth: '280px'
    });
  }

  putDataForCreate() {
    const title = this.languageService.instant('secure.parametize.commission.addTariffs');
    const message = null;
    const messageCenter = false;
    const showButtons = true;
    const icon = null;
    const btnConfirmationText = null;
    return { title, message, messageCenter, showButtons, icon, btnConfirmationText };
  }
}
