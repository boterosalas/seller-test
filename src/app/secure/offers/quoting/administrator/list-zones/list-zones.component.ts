import { Component, OnInit } from '@angular/core';
import { ListZonesService } from './list-zones.service';
import { Logger } from '@app/core';
import { EventEmitterDialogs } from './../events/eventEmitter-dialogs.service';
import { ModalService } from '@app/core';
import { MatDialog } from '@angular/material';
import { trigger, transition, style, animate } from '@angular/animations';
import { DeleteDialogComponent } from '../dialogs/delete/delete-dialog.component';
import { ZoneModel } from '../dialogs/models/zone.model';
import { QuotingAdminService } from '../quoting-administrator.service';
import { LoadingService } from '@app/core';

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
  public openModalCreate: boolean;
  public typeDialog = 0;
  public idToEdit: number;

  constructor(
    private service: ListZonesService,
    private events: EventEmitterDialogs,
    private modalService: ModalService,
    public dialog: MatDialog,
    private quotingService: QuotingAdminService,
    private loadingService: LoadingService
  ) { }

  ngOnInit(): void {
    this.getListZones();
    this.typeDialog = this.service.getDialogType();
    this.events.eventOpenCreateDialog.subscribe((view: boolean) => {
      this.openModalCreate = view;
      this.getListZones();
    });
  }

  /**
   * Function to get all zones from service
   *
   * @memberof ListZonesComponent
   */
  public getListZones(): void {
    this.service.getListZones().subscribe((result: any) => {
      if (result.status === 201 || result.status === 200) {
        const body = JSON.parse(result.body.body);
        this.listZones = body.Data;
        /** Validate if needs to show spinner, because doesnt finished required services */
        if (this.quotingService.getNumberOfService()) {
          this.loadingService.closeSpinner();
        } else {
          this.loadingService.viewSpinner();
        }
      } else {
        this.modalService.showModal('errorService');
      }
    });
  }

  /**
   * Function to create a new zone, launch a dialog in zone type and add mode.
   *
   * @memberof ListZonesComponent
   */
  public createZone(): void {
    this.idToEdit = null;
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

  public confirmDeleteZone(model: ZoneModel): void {
    this.service.deleteZone(model.Id).subscribe((result: any) => {
      if (result.status === 201 || result.status === 200) {
        this.getListZones();
      } else {
        this.modalService.showModal('errorService');
      }
    });
  }

  /**
   * Launch deletes dialog initialized by zone, needs zone id and type of dialog.
   *
   * @param {number} id, zone identifier.
   * @param {number} indexZone index in zone list to identified one in it.
   * @memberof ListZonesComponent
   */
  public deleteZone(model: ZoneModel, indexZone: number): void {
    log.debug('Eliminar');
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '50%',
      minWidth: '390px',
      maxWidth: '1000px',
      disableClose: true,
      data: this.typeDialog
    });

    dialogRef.afterClosed().subscribe(result => {
      /** If has result (True) its because user confirm deleltes transporter */
      if (result) {
        this.confirmDeleteZone(model);
      }
    });
  }

}
