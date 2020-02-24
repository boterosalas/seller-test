import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ShippingMethodsService } from '../../administrator/shipping-methods/shipping-methods.service';
import { ShippingMethodsModel } from '../../administrator/shipping-methods/shipping-methods.model';
import { Logger, LoadingService, ModalService } from '@app/core';
import { ListTransporterService } from '../../administrator/list-transporter/list-transporter.service';
import { TransportModel } from '../../administrator/dialogs/models/transport.model';
import { ListZonesService } from '../../administrator/list-zones/list-zones.service';
import { ZoneModel } from '../../administrator/dialogs/models/zone.model';

const log = new Logger('ModalQuotingSellerComponent');

export enum quotiongDialogAction {
  add,
  update,
  delete
}

@Component({
  selector: 'app-modal-quoting-seller',
  templateUrl: './modal-quoting-seller.component.html',
  styleUrls: ['./modal-quoting-seller.component.scss']
})

export class ModalQuotingSellerComponent implements OnInit {

  action: any;
  actions = quotiongDialogAction;
  public transportTypeList: Array<ShippingMethodsModel>;
  public listTransporters: Array<TransportModel> = [];
  public listZones: ZoneModel[];

  constructor(
    private methodService: ShippingMethodsService,
    private service: ListZonesService,
    private transportService: ListTransporterService,
    private loadingService: LoadingService,
    private modalService: ModalService,
    public dialogRef: MatDialogRef<ModalQuotingSellerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(data, this.actions);
    this.action = data ? data.action : null;
  }

  ngOnInit() {
    this.getTransportMethodRequiredData(); // Get methods.
    this.getListTransporters(); // Get transport
    this.getListZones(); // Get zones.
  }

  /**
   * Function to get required data to charge select in transport form.
   * @memberof ModalQuotingSellerComponent
   */
  public getTransportMethodRequiredData(): void {
    this.methodService.getShippingMethods().subscribe((res: any) => {
      console.log('res: ', res);
      if (res.statusCode === 200) {
        if (res.body) {
          const body = JSON.parse(res.body);
          this.transportTypeList = body.Data;
          console.log(this.transportTypeList);
        }
      } else {
        log.error('Error al intentar obtener los metodos de envios');
      }
    });
  }

  /**
   * Funcion que obtiena las transportadoras
   * @memberof ModalQuotingSellerComponent
   */
  public getListTransporters() {
    this.transportService.getListTransporters().subscribe((result: any) => {
      if (result.status === 201 || result.status === 200) {
        const body = JSON.parse(result.body.body);
        this.listTransporters = body.Data;
        console.log(this.listTransporters);
        /** Validate if needs to show spinner, because doesnt finished required services */
      } else {
        this.modalService.showModal('errorService');
      }
    });
  }

  /**
   * Funcion que obtiene las zonas
   * @memberof ModalQuotingSellerComponent
   */
  public getListZones(): void {
    this.loadingService.viewSpinner();
    this.service.getListZones().subscribe((result: any) => {
      if (result.status === 201 || result.status === 200) {
        const body = JSON.parse(result.body.body);
        this.listZones = body.Data;
        console.log(this.listZones);
      } else {
        this.modalService.showModal('errorService');
      }
      this.loadingService.closeSpinner();
    });
  }

}
