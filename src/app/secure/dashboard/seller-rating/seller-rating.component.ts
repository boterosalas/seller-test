import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { RoutesConst } from '@app/shared';
import { LoadingService } from '@app/core';
import { SupportModalComponent } from '@app/secure/support-modal/support-modal.component';
import { DashboardService } from '../services/dashboard.service';

export interface Calification {
  calification: string;
  date_calificate: string;
  date_issued: string;
}

const ELEMENT_DATA: Calification[] = [
  {calification: 'Excelente', date_calificate: '12-12-12', date_issued: '12-12-12'},
  {calification: 'Excelente', date_calificate: '12-12-12', date_issued: '12-12-12'},
  {calification: 'Excelente', date_calificate: '12-12-12', date_issued: '12-12-12'},
  {calification: 'Excelente', date_calificate: '12-12-12', date_issued: '12-12-12'},
  {calification: 'Aceptable', date_calificate: '12-12-12', date_issued: '12-12-12'},
  {calification: 'Aceptable', date_calificate: '12-12-12', date_issued: '12-12-12'},
  {calification: 'Aceptable', date_calificate: '12-12-12', date_issued: '12-12-12'},
  {calification: 'Deficiente', date_calificate: '12-12-12', date_issued: '12-12-12'},
  {calification: 'Deficiente', date_calificate: '12-12-12', date_issued: '12-12-12'},
  {calification: 'Deficiente', date_calificate: '12-12-12', date_issued: '12-12-12'},
];

@Component({
  selector: 'app-seller-rating',
  templateUrl: './seller-rating.component.html',
  styleUrls: ['./seller-rating.component.scss']
})
export class SellerRatingComponent implements OnInit {

  displayedColumns: string[] = ['calification', 'date_calificate', 'date_issued', 'Actions'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  constructor(
    private router: Router,
    private loadingService: LoadingService,
    public dialog: MatDialog,
    private _dashboard: DashboardService,
  ) { }

  ngOnInit() {
  }

  /**
   * Metodo para abrir el modal de formulario de soporte para apelación
   * @memberof SellerRatingComponent
   */
  openDialogSupport(): void {
    this.loadingService.viewProgressBar();
    const dialogRef = this.dialog.open(SupportModalComponent, {
      width: '90%',
      panelClass: 'full-width-dialog'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadingService.closeProgressBar();
    });
  }

}
