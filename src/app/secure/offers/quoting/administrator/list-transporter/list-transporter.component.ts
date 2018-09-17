import { Component, OnInit } from '@angular/core';
import { ListTransporterService } from './list-transporter.service';
import { Logger } from '@app/core';

const log = new Logger('ListTransporterComponent');

@Component({
  selector: 'app-list-transporter',
  templateUrl: './list-transporter.component.html',
  styleUrls: ['./list-transporter.component.scss']
})

export class ListTransporterComponent implements OnInit {

  public listTransporters: Array<{}>;

  constructor(
    private service: ListTransporterService
  ) { }

  ngOnInit(): void {
    this.getListTransporters();
  }

  getListTransporters() {
    this.listTransporters = this.service.getFakeListTransporter();
  }

  createTransporter() {
    log.debug('Crear');
  }

  editTransporter() {
    log.debug('Editar');
  }

  deleteTransporter() {
    log.debug('Eliminar');
  }
}
