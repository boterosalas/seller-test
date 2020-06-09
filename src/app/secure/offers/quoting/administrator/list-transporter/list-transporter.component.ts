import { Component, OnInit, Input } from '@angular/core';
import { ListTransporterService } from './list-transporter.service';
import { Logger } from '@app/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { EventEmitterDialogs } from './../events/eventEmitter-dialogs.service';
import { ModalService } from '@app/core';
import { TransportModel } from '../dialogs/models/transport.model';
import { DeleteDialogComponent } from '../dialogs/delete/delete-dialog.component';
import { MatDialog } from '@angular/material';
import { ShippingMethodsService } from '../shipping-methods/shipping-methods.service';
import { ShippingMethodsModel } from '../shipping-methods/shipping-methods.model';
import { QuotingAdminService } from '../quoting-administrator.service';
import { LoadingService } from '@app/core';

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

  // Opcines parametrizables desde el llamado del componente.
  @Input() canEdit: boolean;
  @Input() canDelete: boolean;
  @Input() canCreate: boolean;

  /** Initialize required variables   */
  public listTransporters: Array<TransportModel> = [];
  public openModalCreate: boolean;
  public typeDialog: number;
  public idToEdit: number;
  public shippingMethodsList: ShippingMethodsModel[];
  constructor(
    private transportService: ListTransporterService,
    private events: EventEmitterDialogs,
    private modalService: ModalService,
    public dialog: MatDialog,
    private serviceMethods: ShippingMethodsService,
    private quotingService: QuotingAdminService,
    private loadingService: LoadingService
  ) {
    this.openModalCreate = false;
  }

  /**
   * Open dialog to deletes one transport.
   * It needs two params to identificate transport in list and database.
   * to open dialog needs size, data and type dialog.
   * @param {number} id
   * @param {number} indexTransporter
   * @memberof ListTransporterComponent
   */
  public deleteTransporter(id: number, indexTransporter: number): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '50%',
      minWidth: '390px',
      maxWidth: '1000px',
      disableClose: true,
      data:  this.typeDialog
    });

    /**
     * Execute before close dialog and call service function
     */
    dialogRef.afterClosed().subscribe(result => {
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
  public ngOnInit(): void {
    this.typeDialog = this.transportService.getDialogType();
    this.getShippingMethods();
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
  public getListTransporters() {
    this.transportService.getListTransporters().subscribe((result: any) => {
      if (result.status === 201 || result.status === 200) {
        const body = JSON.parse(result.body.body);
        this.listTransporters = body.Data;
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

  public getShippingMethods(): void {
    this.serviceMethods.getShippingMethods().subscribe((res: any) => {
      if (res.statusCode === 200) {
        const body = JSON.parse(res.body);
        this.shippingMethodsList = body.Data;
        /** Validate if needs to show spinner, because doesnt finished required services */
        if (this.quotingService.getNumberOfService()) {
          this.loadingService.closeSpinner();
        } else {
          this.loadingService.viewSpinner();
        }
        this.getListTransporters();
      } else {
        // log.error('Error al intentar obtener los metodos de envios');
      }
    });
  }

  public getNameMethod(idMethod: number): string {
    let nameMethod = 'No encontrado';
    if (this.shippingMethodsList && this.shippingMethodsList.length) {
      for (let i = 0; i < this.shippingMethodsList.length; i++) {
        if (this.shippingMethodsList[i].Id === idMethod) {
          nameMethod = this.shippingMethodsList[i].Name;
          return nameMethod;
        }
      }
    }
    return nameMethod;
  }

  /**
   *  Function to open dialog component initialize with transport type and add mode
   */
  public createTransporter(): void {
    this.idToEdit = null;
    this.openModalCreate = true;
  }

  /**
   * Function to open dialog component initialize with transport type and update mode
   *
   * @param {TransportModel} item
   * @memberof ListTransporterComponent
   */
  public editTransporter(item: TransportModel): void {
    this.idToEdit = item.Id;
    this.openModalCreate = true;
  }

  /**
   *
   * @param {number} idTransport
   * @param {number} indexList
   * @memberof ListTransporterComponent
   */
  private deleteTransporterServ(idTransport: number, indexList: number): void {
    this.loadingService.viewSpinner();
    this.transportService.deleteTransporter(idTransport)
      .subscribe(
        (result: any) => {
          if (result.statusCode === 201 || result.statusCode === 200) {
            this.getListTransporters();
            this.loadingService.closeSpinner();
          } else {
            this.modalService.showModal('error');
          }
        }
      );
  }
}
