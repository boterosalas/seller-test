import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { CalificationService } from '../../quality.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';
import { LoadingService } from '@app/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-detail-calification',
  templateUrl: './detail-calification.component.html',
  styleUrls: ['./detail-calification.component.scss']
})
export class DetailCalificationComponent implements OnInit {

  @Input() detailByElemet: any;
  @Input() nameSeller: string;
  @Input() idSeller: any;
  @Output() showContainerDetailSend = new EventEmitter<any>();

  public colorCalificationPromiseDelivery = 'default';
  public colorCalificationCase = 'default';
  public colorCalificationCanceled = 'default';
  public setFormatDateInfoSellerMonthQuality = '';
  public setFormatDateInfoSellerGenrateDate = '';

  public penaltyOutSideDelivery = 0;
  public penaltyCanceledBySeller = 0;
  public penaltyTotal = 0;
  public qualificationDate: any;

  public params: any;

  public monthEN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  public monthES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];



  constructor(
    private calificationService: CalificationService,
    public dialog: MatDialog,
    private languageService: TranslateService,
    private loadingService: LoadingService,
    public snackBar?: MatSnackBar,
  ) { }

  ngOnInit() {
    this.setDetailsBySeller();
  }
/**
 * funcion para calcular la sumatoria total y el color de la calificacion
 *
 * @memberof DetailCalificationComponent
 */
setDetailsBySeller() {
  if ( this.detailByElemet && this.detailByElemet.detail) {
    this.sumatoryPenality(this.detailByElemet);
    this.colorCalificationPromiseDelivery = this.setClassColorByCalification(this.detailByElemet.qualificationPromiseDelivery.qualification);
    this.colorCalificationCase = this.setClassColorByCalification(this.detailByElemet.qualificationCase.qualification);
    this.colorCalificationCanceled = this.setClassColorByCalification(this.detailByElemet.qualificationCanceled.qualification);
    this.setFormatDateInfoSellerMonthQuality = this.formatNameMonth(this.detailByElemet.qualificationDate);
    this.setFormatDateInfoSellerGenrateDate = this.detailByElemet.generatedDate;
    this.qualificationDate = this.detailByElemet.qualificationDate;
  }
  }
/**
 * funcion para setear el color en la variables
 *
 * @param {number} calification
 * @returns
 * @memberof DetailCalificationComponent
 */
setClassColorByCalification(calification: number) {
    let classColorByCalification = 'default';
    if (calification < 3) {
      classColorByCalification = 'deficient';
    }

    if (calification >= 3 && calification < 5) {
      classColorByCalification = 'acceptable';
    }

    if (calification >= 5) {
      classColorByCalification = 'excellent';
    }

    return classColorByCalification;
  }
/**
 *  funcion formato de la fecha
 *
 * @param {string} valueDate
 * @returns
 * @memberof DetailCalificationComponent
 */
formtDateYearMonth(valueDate: string) {
    if (valueDate && valueDate.includes('/')) {
      const arrayDate = valueDate.split('/');
      return arrayDate[1] + arrayDate[0];
    }
  }
/**
 * funcion para formatar la fecha con el nombre del mes
 *
 * @param {string} date
 * @returns
 * @memberof DetailCalificationComponent
 */
formatNameMonth(date: string) {
    if (date && date.includes('/')) {
      const arrayDate = date.split('/');
      const month = this.monthES[parseInt(arrayDate[0], 0) - 1];
      return month + ' (' + arrayDate[1] + ')';
    }
  }
/**
 * funcion para dar formato dia mes y año
 *
 * @param {*} date
 * @returns
 * @memberof DetailCalificationComponent
 */
formtDateDayMonthYear(date: any) {
    const format = 'DD/MM/YYYY';
    const stringDate = moment(date.toString()).utc().format(format).toString();
    return stringDate;
  }
/**
 * funcion para sumar la penalidad
 *
 * @param {*} details
 * @memberof DetailCalificationComponent
 */
sumatoryPenality(details: any) {
  if (details) {
    if (details.qualificationCanceled && details.qualificationCanceled.valuePenalty) {
      this.penaltyCanceledBySeller = details.qualificationCanceled.valuePenalty;
    }
    if (details.qualificationPromiseDelivery && details.qualificationPromiseDelivery.valuePenalty) {
      this.penaltyOutSideDelivery = details.qualificationPromiseDelivery.valuePenalty;
    }
  }
    this.penaltyTotal = this.penaltyOutSideDelivery + this.penaltyCanceledBySeller;
  }
/**
 * funcion regresar a la lista
 *
 * @memberof DetailCalificationComponent
 */
backTolist() {
    this.showContainerDetailSend.emit();
  }
/**
 * funcion para confirmar la eliminacion del registro de las calificaciones
 *
 * @param {*} element
 * @param {*} idSeller
 * @param {string} idToProcess
 * @param {string} Ean
 * @param {number} typeExclusion
 * @memberof DetailCalificationComponent
 */
confirmDeleteCalification(element: any , qualificationDate: string , idSeller: any, idToProcess: string, Ean: string, typeExclusion: number ) {
    const params = {
     orderNumber: element.orderNumber,
     customerName: element.customerName,
     orderStatus: element.orderStatus,
     totalCommission: element.totalCommission,
     penalty: element.penalty,
     idSeller: idSeller,
     idToProcess: idToProcess,
     ean: Ean,
     qualificationDate: qualificationDate,
     typeExclusion: typeExclusion
   };
    const dialogRef = this.dialog.open(ModalConfirmComponent, {
      width: '70%',
      minWidth: '300px',
      disableClose: false,
      data:  params
    });

    const dialogIntance = dialogRef.componentInstance;
    dialogIntance.processFinish$.subscribe((val) => {
      this.loadingService.viewSpinner();
      this.recalculateQualitative();
    });
  }
/**
 * funcion para recalcular
 *
 * @memberof DetailCalificationComponent
 */
recalculateQualitative() {
    if (this.detailByElemet && this.detailByElemet.qualificationDate && this.detailByElemet.idSeller ) {
      const arrayDate = this.detailByElemet.qualificationDate.split('/');
      const params = this.detailByElemet.idSeller + '/' + arrayDate[1] + arrayDate[0];
        this.calificationService.getListCalificationsBySeller(params).subscribe((res: any) => {
        this.detailByElemet = res.viewModel;
        this.penaltyOutSideDelivery = 0;
        this.penaltyCanceledBySeller = 0;
        this.setDetailsBySeller();
        this.loadingService.closeSpinner();
        this.dialog.closeAll();
      });
    }
  }
/**
 * funcion para notificar al vendedor
 *
 * @memberof DetailCalificationComponent
 */
notificateSeller() {
    this.loadingService.viewSpinner();
    const params = {
      idSeller : this.idSeller,
      qualificationDate: this.qualificationDate
    };
    this.calificationService.notificate(params).subscribe((res: any) => {
      if (res) {
        this.loadingService.closeSpinner();
        this.snackBar.open(this.languageService.instant('secure.quality.quality-score.message-send-quality'), this.languageService.instant('actions.close'), {
          duration: 3000,
      });
      }
    });
  }
}
