import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { MatDialog, MatTabChangeEvent } from '@angular/material';
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
  activeButtonHistory: Boolean = true;
  activeButtonNews: Boolean = true;

  _dataFilterDispersion: any
  _dataFilterNewsCollected: any
  showButtonDownloadHistory: Boolean = true;
  showButtonDownloadNews: Boolean = false;


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
      this.activeButtonHistory = false;
    } else {
      this.activeButtonHistory = true;
    }
    return this._dataFilterDispersion;
  }

  /**
   * Evento que escucha los aprametros de filtro novedades cobradas
   * @param {*} param
   * @memberof DetailPaymentComponent
   */
  dataFilterNewsCollected(param: any) {
    this._dataFilterNewsCollected = param ? param : null;
    const {CutOffDate, DispersionDate} = param;
    if(CutOffDate !== undefined || DispersionDate !== undefined) {
      this.activeButtonNews = false;
    } else {
      this.activeButtonNews = true;
    }

    return this._dataFilterNewsCollected;
  }


  onTabChanged(e:MatTabChangeEvent) {
    if(e.index === 0) {
      this.showButtonDownloadHistory = true;
      this.showButtonDownloadNews = false;
    } else {
      this.showButtonDownloadHistory = false;
      this.showButtonDownloadNews = true;
    }
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
    const dialogRef = this.dialog.open(DownloadDetailPaymentComponent, {
      width: '60%',
      data: infoData,
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
