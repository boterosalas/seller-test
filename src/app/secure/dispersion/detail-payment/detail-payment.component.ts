import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { LoadingService } from '@app/core';
import { EventEmitterSeller } from '@app/shared/events/eventEmitter-seller.service';
import { DownloadDetailPaymentComponent } from './download-detail-payment/download-detail-payment.component';

@Component({
  selector: 'app-detail-payment',
  templateUrl: './detail-payment.component.html',
  styleUrls: ['./detail-payment.component.scss']
})
export class DetailPaymentComponent implements OnInit {
  sellerData: any;
  activeTabs: Boolean = false;

  activeButton: Boolean = true;

  _dataFilterDispersion: any
  _dataFilterNewsCollected: any


  constructor(
    private emitterSeller: EventEmitterSeller,
    private loadingService?: LoadingService,
    private dialog?: MatDialog,
  ) { }

  ngOnInit() {
    this.selectSeller();
  }

  /**
   * Metodo para seleccionar el seller y enviarlos a los tabs la info.
   * @memberof DetailPaymentComponent
   */
  selectSeller() {
    this.loadingService.viewSpinner();
    this.emitterSeller.eventSearchSeller.subscribe(data => {
      if (data) {
        this.activeTabs = true;
        this.sellerData = data;
      } else {
        this.activeTabs = false;
      }
      this.loadingService.closeSpinner();
    });
  }

  /**
   * Evento que escucha los aprametros de filtro historico de pagos
   * @param {*} param
   * @memberof DetailPaymentComponent
   */
  dataFilterDispersion(param: any) {
    this._dataFilterDispersion = param ? param : null;
    // Activar/Inactivar el boton de descarga del detalle de pagos
    const {CutOffDate, DispersionDate} = param;
    if(CutOffDate !== undefined || DispersionDate !== undefined) {
      this.activeButton = false;
    } else {
      this.activeButton = true;
    }
  }

  /**
   * Evento que escucha los aprametros de filtro novedades cobradas
   * @param {*} param
   * @memberof DetailPaymentComponent
   */
  dataFilterNewsCollected(param: any) {
    this._dataFilterNewsCollected = param ? param : null;
  }

  /**
   * Metodo para abrir modal de descarga de detalle de pagos
   * @memberof DetailPaymentComponent
   */
  openModalDownloadDetailPayment(): void {
    const infoData = {
      dataSeller: this.sellerData,
      dataFilterTab1: this._dataFilterDispersion,
      dataFilterTab2: this._dataFilterNewsCollected
    }
    console.log(infoData);
    const dialogRef = this.dialog.open(DownloadDetailPaymentComponent, {
      width: '60%',
      data: infoData,
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
