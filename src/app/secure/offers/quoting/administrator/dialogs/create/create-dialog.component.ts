import { Component, OnInit, Input } from '@angular/core';
import { Logger } from '@app/core';
import { EventEmitterDialogs } from './../../events/eventEmitter-dialogs.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TransportModel } from '../models/transport.model';
import { ShippingMethodsModel } from '../../shipping-methods/shipping-methods.model';
import { ZoneModel } from '../models/zone.model';
import { ListTransporterService } from '../../list-transporter/list-transporter.service';
import { ListZonesService } from '../../list-zones/list-zones.service';
import { ShippingMethodsService } from '../../shipping-methods/shipping-methods.service';
import { ModalService } from '@app/core';
import { MatSnackBar } from '@angular/material';

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
  public chargeData: boolean;
  private regexDaneCode = /^(((\w){8})(\,){0,1})+$/; // Validate alphanumerics sepharate by comma regex
  @Input() typeDialog: number;
  @Input() idToEdit: number;

  constructor(
    private events: EventEmitterDialogs,
    private transportService: ListTransporterService,
    private modalService: ModalService,
    private zoneService: ListZonesService,
    private methodService: ShippingMethodsService,
    private snackBar: MatSnackBar
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
    if (this.typeDialog === this.dialogTransport) {
      if (this.idToEdit !== null) {
        this.dialogMode = true;
        this.getTransportData();
      } else {
        this.createTransportDialog(null);
      }
    } else {
      if (this.idToEdit !== null) {
        this.dialogMode = true;
        this.chargeZone();
      } else {
        this.createZoneDialog(null);
      }
    }
  }

  public chargeZone(): void {
    this.zoneService.getZone(this.idToEdit).subscribe((result: any) => {
      if (result.status === 201 || result.status === 200) {
        const body = JSON.parse(result.body.body);
        this.createZoneDialog(body.Data);
      } else {
        this.modalService.showModal('errorService');
      }
    });
  }

  /**
   * Function to get required data to charge select in transport form.
   *
   * @memberof CreateDialogComponent
   */
  public getTransportMethodRequiredData(): void {
    this.methodService.getShippingMethods().subscribe((res: any) => {
      if (res.statusCode === 200) {
        const body = JSON.parse(res.body);
        this.transportTypeList = body.Data;
      } else {
        log.error('Error al intentar obtener los metodos de envios');
      }
    });
  }


  /**
   * Return boolean value depends of dialog initialize
   *
   * @param {number} type
   * @returns {boolean}
   * @memberof CreateDialogComponent
   */
  public showDialogForm(type: number): boolean {
    return type === this.typeDialog && this.chargeData;
  }

  /**
   * Function to get data to edit transport.
   * First get transport data to execute create dialog function with it.
   * @memberof CreateDialogComponent
   */
  public getTransportData(): void {
    this.transportService.getTransport(this.idToEdit).subscribe((result: any) => {
      if (result.status === 201 || result.status === 200) {
        const body = JSON.parse(result.body.body);
        this.createTransportDialog( body.Data );
      } else {
        this.modalService.showModal('errorService');
      }
    });
  }

  /**
   * Close dialog.
   */
  closeDialog(recharge: boolean = false): void {
    this.events.openDialogCreate(recharge);
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
      name = dataEdit.Name;
      idMethod = dataEdit.IdShippingMethod;
    }
    this.formTransporter = new FormGroup({
      Name: new FormControl(name, [
        Validators.required,
      ]),
      IdShippingMethod: new FormControl(idMethod, Validators.required)
    });
    this.chargeData = true;
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
      name = dataEdit.Name;
      daneCode = dataEdit.DaneCode;
    }
    this.formZone = new FormGroup({
      Name: new FormControl(name, [
        Validators.required,
      ]),
      DaneCode: new FormControl(daneCode, [
        Validators.required,
        Validators.pattern(this.regexDaneCode)
      ])
    });
    this.chargeData = true;
  }

  /**
   * Submit function from dialog.
   *
   * @memberof CreateDialogComponent
   */
  saveTransport(): void {
    if (this.formTransporter.valid) {
      if (this.dialogMode) {
        this.updateTransport(this.formTransporter.value);
      } else {
        this.createTransport(this.formTransporter.value);
      }
    }
  }

  /**
   * Submit function from zones form.
   * Valid form and verify if is to create or update zone.
   * @memberof CreateDialogComponent
   */
  saveZone(): void {
    if (this.formZone.valid) {
      if (this.dialogMode) {
        this.updateZone(this.formZone.value);
      } else {
        this.addZone(this.formZone.value);
      }
    }
  }

  public updateZone(dataToUpdate: ZoneModel): void {
    dataToUpdate.Id = this.idToEdit;
    const dataToSend: ZoneModel[] = [];
    dataToSend.push(dataToUpdate);
    this.zoneService.updateZone(dataToSend).subscribe((result: any) => {
      if (result.status === 201 || result.
        status === 200) {
        this.showUpdateToast();
        this.closeDialog();
      } else {
        this.modalService.showModal('errorService');
      }
    });
  }

  public addZone(dataToAdd: ZoneModel): void {
    const dataToSend: ZoneModel[] = [];
    dataToSend.push(dataToAdd);
    this.zoneService.addZone(dataToSend).subscribe((result: any) => {
      if (result.status === 201 || result.status === 200) {
        this.closeDialog(false);
        this.showAddToast();
      } else {
        this.modalService.showModal('errorService');
      }
    });
  }

  /**
   * Send to transportService data to edit transport.
   *
   * @param {TransportModel} data
   * @memberof CreateDialogComponent
   */
  updateTransport(data: TransportModel): void {
    data.Id = this.idToEdit;
    this.transportService.updateTransporter(data)
      .subscribe(
        (result: any) => {
          if (result.statusCode === 201 || result.statusCode === 200) {
            const response = JSON.parse(result.body);
            if (response.Data) {
              this.closeDialog(false);
              this.showUpdateToast();
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
   * Show add toast with message.
   *
   * @memberof CreateDialogComponent
   */
  public showAddToast(): void {
    this.snackBar.open('Agregó correctamente', 'Cerrar', {
      duration: 3000,
    });
  }

  /**
   * Show update toast with message.
   *
   * @memberof CreateDialogComponent
   */
  public showUpdateToast(): void {
    this.snackBar.open('Actualizó correctamente', 'Cerrar', {
      duration: 3000,
    });
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
          if (result.statusCode === 201 || result.statusCode === 200) {
              this.events.openDialogCreate(false);
              this.showAddToast();
          } else {
            this.modalService.showModal('errorService');
          }
        }
      );
  }

}
