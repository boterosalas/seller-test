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
   * Metodo para abrir modal de descarga de detalle de pagos
   * @memberof DetailPaymentComponent
   */
  openModalDownloadDetailPayment(): void {
    const dialogRef = this.dialog.open(DownloadDetailPaymentComponent, {
      width: '60%',
      data: this.sellerData
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
