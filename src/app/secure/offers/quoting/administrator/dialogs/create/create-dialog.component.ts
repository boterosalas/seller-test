import { Component, OnInit, Input } from '@angular/core';
import { Logger } from '@app/core';
import { EventEmitterDialogs } from './../../events/eventEmitter-dialogs.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CreateDialogService } from './create-dialog.service';
import { TransportModel } from '../models/transport.model';
import { ShippingMethodsModel } from '../../shipping-methods/shipping-methods.model';
import { ZoneModel } from '../models/zone.model';
import { ListTransporterService } from '../../list-transporter/list-transporter.service';
import { ListZonesService } from '../../list-zones/list-zones.service';
import { ShippingMethodsService } from '../../shipping-methods/shipping-methods.service';
import { ModalService } from '@app/core';

const log = new Logger('CreateDialogComponent');

@Component({
  selector: 'app-create-dialog',
  templateUrl: './create-dialog.component.html',
  styleUrls: ['./../dialog.component.scss']
})
export class CreateDialogComponent implements OnInit {

  public formTransporter: FormGroup;
  public formZone: FormGroup;
  public transportTypeList: Array<ShippingMethodsModel>;
  public dialogMode = false; // False: Add mode, True: Update mode.
  public transportDataToEdit: TransportModel;
  public dialogTransport: number;
  public dialogZone: number;
  @Input() typeDialog: number;
  @Input() idToEdit: number;

  constructor(
    private events: EventEmitterDialogs,
    private service: CreateDialogService,
    private transportService: ListTransporterService,
    private modalService: ModalService,
    private zoneService: ListZonesService,
    private methodService: ShippingMethodsService
  ) { }

  /**
   * Initialize create dialog component.
   *
   * @memberof CreateDialogComponent
   */
  ngOnInit(): void {
    this.dialogTransport = this.transportService.getDialogType();
    this.dialogZone = this.zoneService.getDialogType();

    /** Verify if component initialization has data to edit or create  */
    if (this.showDialogForm(this.dialogTransport)) {
      if (this.idToEdit !== null) {
        this.dialogMode = true;
        this.getTransportData();
      } else {
        this.createTransportDialog(null);
      }
    } else {
      if (this.idToEdit) {
        this.dialogMode = true;
        this.createZoneDialog(null);
      } else {
        this.createZoneDialog(null);
      }
    }
  }

  /**
   * Function to get required data to charge select in transport form.
   *
   * @memberof CreateDialogComponent
   */
  public getTransportMethodRequiredData(): void {
    this.transportTypeList = this.methodService.getFakeListShipingMethods();
  }


  /**
   * Return boolean value depends of dialog initialize
   *
   * @param {number} type
   * @returns {boolean}
   * @memberof CreateDialogComponent
   */
  public showDialogForm(type: number): boolean {
    return type === this.typeDialog;
  }

  /**
   * Function to get data to edit transport.
   * First get transport data to execute create dialog function with it.
   * @memberof CreateDialogComponent
   */
  public getTransportData(): void {
    this.transportDataToEdit = this.transportService.getFakeTransporter(this.idToEdit);
    this.createTransportDialog(this.transportDataToEdit);
  }

  /**
   * Close dialog.
   */
  closeDialog(): void {
    this.events.openDialogCreate(false);
  }

  /**
   * Function to create reactive transport form, can initializate by edit and add mode.
   * 1. To edit mode: needs data to show in this form
   * 2. To add dont need data to show.
   * @param {TransportModel} dataEdit, model with transport data.
   * @memberof CreateDialogComponent
   */
  createTransportDialog(dataEdit: TransportModel): void {
    this.getTransportMethodRequiredData(); // Get methods.
    let name: string;
    let idMethod: number;
    if (dataEdit) {
      name = dataEdit.name;
      idMethod = dataEdit.idMethod;
    }
    this.formTransporter = new FormGroup({
      name: new FormControl(name, [
        Validators.required,
        Validators.maxLength(20)
      ]),
      typeTransport: new FormControl(idMethod, Validators.required)
    });
  }

  /**
   * Initialize the zone form.
   *
   * @param {ZoneModel} dataEdit
   * @memberof CreateDialogComponent
   */
  createZoneDialog(dataEdit: ZoneModel): void {
    let name: string;
    let daneCode: string;
    if (dataEdit) {
      name = dataEdit.name;
      daneCode = dataEdit.daneCode;
    }
    this.formZone = new FormGroup({
      nameZone: new FormControl(name, [
        Validators.required,
        Validators.maxLength(20)
      ]),
      danceCode: new FormControl(name, [
        Validators.required,
        Validators.maxLength(20)
      ])
    });
  }

  /**
   * Submit function from dialog.
   *
   * @memberof CreateDialogComponent
   */
  saveTransport(): void {
    log.debug(this.formTransporter.valid);
    if (this.formTransporter.valid) {
      if (this.dialogMode) {
        this.updateTransport(this.formTransporter.value);
      } else {
        this.createTransport(this.formTransporter.value);
      }
    }
  }


  saveZone(): void {
    if (this.formZone.valid) {
      if (this.dialogMode) {
        this.updateZone(this.formTransporter.value);
      } else {
        this.addZone(this.formTransporter.value);
      }
    }
  }

  public updateZone(dataToUpdate: ZoneModel): void {

  }

  public addZone(dataToUpdate: ZoneModel): void {

  }

  /**
   * Send to transportService data to edit transport.
   *
   * @param {TransportModel} data
   * @memberof CreateDialogComponent
   */
  updateTransport(data: TransportModel): void {
    this.transportService.updateTransporter(data)
      .subscribe(
        (result: any) => {
          if (result.status === 201 || result.status === 200) {
            const response = JSON.parse(result.body.body);
            if (response.Data) {
              this.events.openDialogCreate(false);
              this.modalService.showModal('success');
            } else if (!response.Data) {
              this.modalService.showModal('error');
            }
          } else {
            this.modalService.showModal('errorService');
          }
        }
      );
  }

  /**
   * Send to transportService data to create transport.
   *
   * @param {TransportModel} data
   * @memberof CreateDialogComponent
   */
  createTransport(data: TransportModel): void {
    this.transportService.createTransporter(data)
      .subscribe(
        (result: any) => {
          if (result.status === 201 || result.status === 200) {
            const response = JSON.parse(result.body.body);
            if (response.Data) {
              this.events.openDialogCreate(false);
              this.modalService.showModal('success');
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
