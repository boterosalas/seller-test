import { Component, OnInit } from '@angular/core';
import { ListTransporterService } from './list-transporter.service';
import { Logger } from '@app/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { EventEmitterDialogs } from './../events/eventEmitter-dialogs.service';

const log = new Logger('ListTransporterComponent');
const dialogTypeTransporter = 1;

@Component({
  selector: 'app-list-transporter',
  templateUrl: './list-transporter.component.html',
  styleUrls: ['./list-transporter.component.scss'],
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({ transform: 'translateX(100%)', opacity: 0 }),
          animate('90ms', style({ transform: 'translateX(0)', opacity: 1 }))
        ]),
        transition(':leave', [
          style({ transform: 'translateX(0)', opacity: 1 }),
          animate('90ms', style({ transform: 'translateX(100%)', opacity: 0 }))
        ])
      ]
    )
  ],
})

export class ListTransporterComponent implements OnInit {

  private listTransporters: Array<{}>;
  private openModalCreate: boolean;
  public typeDialog = dialogTypeTransporter;
  public idToEdit: number;

  constructor(
    private service: ListTransporterService,
    private events: EventEmitterDialogs
  ) {
    this.openModalCreate = false;
  }

  ngOnInit(): void {
    this.getListTransporters();
    this.events.eventOpenCreateDialog.subscribe((view: boolean) => {
      this.openModalCreate = view;
    });
  }

  getListTransporters() {
    this.listTransporters = this.service.getFakeListTransporter();
  }

  createTransporter(): void {
    log.debug('Crear');
    this.idToEdit = null;
    this.openModalCreate = true;
  }

  editTransporter(item: any): void {
    log.debug('Editar');
    this.idToEdit = item.idTransporter;
    this.openModalCreate = true;
  }

  deleteTransporter(): void {
    log.debug('Eliminar');
  }
}
