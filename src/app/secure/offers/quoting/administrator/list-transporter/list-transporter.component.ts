import { Component, OnInit } from '@angular/core';
import { ListTransporterService } from './list-transporter.service';
import { Logger } from '@app/core';
import { CreateDialogComponent } from '../dialogs/create/create-dialog.component';
import { MatDialog } from '@angular/material';

const log = new Logger('ListTransporterComponent');

@Component({
  selector: 'app-list-transporter',
  templateUrl: './list-transporter.component.html',
  styleUrls: ['./list-transporter.component.scss']
})

export class ListTransporterComponent implements OnInit {

  public listTransporters: Array<{}>;

  constructor(
    public dialog: MatDialog,
    private service: ListTransporterService
  ) { }

  ngOnInit(): void {
    this.getListTransporters();
  }

  getListTransporters() {
    this.listTransporters = this.service.getFakeListTransporter();
  }

  createTransporter(): void {
    log.debug('Crear');
    const dialogRef = this.dialog.open(CreateDialogComponent, {
      disableClose: true,
      width: '760px',
      height: '500px',
    });
    dialogRef.afterClosed().subscribe(result => {
      log.debug('The dialog was closed');
    });

  }

  editTransporter() {
    log.debug('Editar');
  }

  deleteTransporter() {
    log.debug('Eliminar');
  }
}
