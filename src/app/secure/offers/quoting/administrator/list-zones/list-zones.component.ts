import { Component, OnInit } from '@angular/core';
import { ListZonesService } from './list-zones.service';
import { Logger } from '@app/core';
import { EventEmitterDialogs } from './../events/eventEmitter-dialogs.service';
import { ModalService } from '@app/core';
import { MatDialog } from '@angular/material';
import { trigger, transition, style, animate } from '@angular/animations';
import { DeleteDialogComponent } from '../dialogs/delete/delete-dialog.component';

const log = new Logger('ListZonesComponent');

@Component({
  selector: 'app-list-zones',
  templateUrl: './list-zones.component.html',
  styleUrls: ['./list-zones.component.scss'],
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
export class ListZonesComponent implements OnInit {
  public listZones: Array<{}>;
  private openModalCreate: boolean;
  public typeDialog = 0;
  public idToEdit: number;

  constructor(
    private service: ListZonesService,
    private events: EventEmitterDialogs,
    private modalService: ModalService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getListZones();
    this.typeDialog = this.service.getDialogType();
    this.events.eventOpenCreateDialog.subscribe((view: boolean) => {
      this.openModalCreate = view;
      if (!view) {

      }
    });
  }

  /**
   * Function to get all zones from service
   *
   * @memberof ListZonesComponent
   */
  public getListZones(): void {
    this.listZones = this.service.getFakeListZones();
  }

  /**
   * Function to create a new zone, launch a dialog in zone type and add mode.
   *
   * @memberof ListZonesComponent
   */
  public createZone(): void {
    this.idToEdit = 0;
    this.openModalCreate = true;
  }

  /**
   * Function to edit a zone, launch dialog in zone type and edit mode.
   * Required zone identifier.
   * @param {number} id
   * @memberof ListZonesComponent
   */
  public editZone(id: number): void {
    this.idToEdit = id;
    this.openModalCreate = true;
  }

  /**
   * Launch deletes dialog initialized by zone, needs zone id and type of dialog.
   *
   * @param {number} id, zone identifier.
   * @param {number} indexZone index in zone list to identified one in it.
   * @memberof ListZonesComponent
   */
  public deleteZone(id: number, indexZone: number): void {
    log.debug('Eliminar');
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '50%',
      minWidth: '390px',
      maxWidth: '1000px',
      disableClose: true,
      data:  this.typeDialog
    });

    dialogRef.afterClosed().subscribe(result => {
      /** If has result (True) its because user confirm deleltes transporter */
      console.log('eliminar zona');
      if (result) {

      }
    });
  }

}
