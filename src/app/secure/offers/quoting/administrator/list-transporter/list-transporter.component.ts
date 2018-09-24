import { Component, OnInit } from '@angular/core';
import { ListTransporterService } from './list-transporter.service';
import { Logger } from '@app/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { EventEmitterDialogs } from './../events/eventEmitter-dialogs.service';
import { ModalService } from '@app/core';
import { TypeTransportModel } from '../dialogs/models/transports-type.model';
import { DeleteDialogComponent } from '../dialogs/delete/delete-dialog.component';
import { MatDialog } from '@angular/material';

const log = new Logger('ListTransporterComponent');

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
  public typeDialog: number;
  public idToEdit: number;

  constructor(
    private transportService: ListTransporterService,
    private events: EventEmitterDialogs,
    private modalService: ModalService,
    public dialog: MatDialog
  ) {
    this.openModalCreate = false;
  }

  /**
   * Open dialog to delete a transporter
   *
   * @memberof ListTransporterComponent
   */
  deleteTransporter(id: number, indexTransporter: number): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '50%',
      minWidth: '390px',
      maxWidth: '1000px',
      disableClose: true,
      data:  this.typeDialog
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', id, indexTransporter);
      /** If has result (True) its because user confirm deleltes transporter */
      if (result) {
        this.deleteTransporterServ(id, indexTransporter);
      }
    });
  }

  /**
   * Initialize component with
   * 1. Get type of dialog.
   * 2. Get transport list.
   * 3. Event launch when dialog edit or add close.
   * @memberof ListTransporterComponent
   */
  ngOnInit(): void {
    this.typeDialog = this.transportService.getDialogType();
    this.getListTransporters();
    this.events.eventOpenCreateDialog.subscribe((view: boolean) => {
      this.openModalCreate = view;
      if (!view) {
        this.getListTransporters();
      }
    });
  }

  /**
   * Function to get transport list.
   *
   * @memberof ListTransporterComponent
   */
  getListTransporters() {
    this.listTransporters = this.transportService.getFakeListTransporter();
  }

  /**
   *  Function to open dialog component initialize with transport type and add mode
   */
  createTransporter(): void {
    log.debug('Crear');
    this.idToEdit = null;
    this.openModalCreate = true;
  }

  /**
   * Function to open dialog component initialize with transport type and update mode
   *
   * @param {TypeTransportModel} item
   * @memberof ListTransporterComponent
   */
  editTransporter(item: TypeTransportModel): void {
    log.debug('Editar');
    this.idToEdit = item.id;
    this.openModalCreate = true;
  }

  /**
   *
   * @param {number} idTransport
   * @param {number} indexList
   * @memberof ListTransporterComponent
   */
  deleteTransporterServ(idTransport: number, indexList: number): void {
    this.transportService.deleteTransporter(idTransport)
      .subscribe(
        (result: any) => {
          if (result.status === 201 || result.status === 200) {
            const response = JSON.parse(result.body.body);
            if (response.Data) {
              this.modalService.showModal('success');
              this.listTransporters.splice(indexList, 1);
            } else if (!response.Data) {
              this.modalService.showModal('error');
            }
          } else {
            this.modalService.showModal('errorService');
          }
        }
      );
  }
}
