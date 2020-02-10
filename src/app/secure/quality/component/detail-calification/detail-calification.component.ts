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

  setDetailsBySeller() {
    console.log(this.detailByElemet);
    this.sumatoryPenality(this.detailByElemet.detail);
    this.colorCalificationPromiseDelivery = this.setClassColorByCalification(this.detailByElemet.qualificationPromiseDelivery.qualification);
    this.colorCalificationCase = this.setClassColorByCalification(this.detailByElemet.qualificationCase.qualification);
    this.colorCalificationCanceled = this.setClassColorByCalification(this.detailByElemet.qualificationCanceled.qualification);
    this.setFormatDateInfoSellerMonthQuality = this.formatNameMonth(this.detailByElemet.qualificationDate);
    this.setFormatDateInfoSellerGenrateDate = this.formatNameMonth(this.detailByElemet.generatedDate);
  }

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

  formtDateYearMonth(valueDate: string) {
    if (valueDate && valueDate.includes('/')) {
      const arrayDate = valueDate.split('/');
      return arrayDate[1] + arrayDate[0];
    }
  }

  formatNameMonth(date: string) {
    const formtDateMonth = date.toString().substr(-2, 2);
    const formtDateYear = date.toString().substr(-20, 4);
    const month = this.monthES[parseInt(formtDateMonth, 0) - 1];
    return month + ' (' + formtDateYear + ')';
  }

  formtDateDayMonthYear(date: any) {
    const format = 'DD/MM/YYYY';
    const stringDate = moment(date.toString()).utc().format(format).toString();
    return stringDate;
  }

  sumatoryPenality(details: any) {
    if ( details.ordersOutsideDeliveryDate && details.ordersOutsideDeliveryDate.length > 0) {
       details.ordersOutsideDeliveryDate.forEach(element => {
      this.penaltyOutSideDelivery += element.penalty;
    });
    }
    if (details.ordersOutsideDeliveryDate && details.ordersCanceledBySellerResponsibility.length > 0) {
       details.ordersCanceledBySellerResponsibility.forEach(element => {
      this.penaltyCanceledBySeller += element.penalty;
    });
    }
    this.penaltyTotal = this.penaltyOutSideDelivery + this.penaltyCanceledBySeller;
  }

  backTolist() {
    this.showContainerDetailSend.emit();
  }

  confirmDeleteCalification(element: any , idSeller: any, idToProcess: string, Ean: string, typeExclusion: number ) {
    const params = {
     orderNumber: element.orderNumber,
     customerName: element.customerName,
     orderStatus: element.orderStatus,
     totalCommission: element.totalCommission,
     penalty: element.penalty,
     idSeller: idSeller,
     idToProcess: idToProcess,
     ean: Ean,
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

  recalculateQualitative() {
    if (this.detailByElemet && this.detailByElemet.qualificationDate && this.detailByElemet.idSeller ) {
      const params = this.detailByElemet.idSeller + '/' + this.detailByElemet.qualificationDate;
        this.calificationService.getListCalificationsBySeller(params).subscribe((res: any) => {
        this.detailByElemet = res.viewModel;
        this.loadingService.closeSpinner();
        this.dialog.closeAll();
      });
    }
  }

  notificateSeller() {
    this.loadingService.viewSpinner();
    this.calificationService.notificate(this.idSeller).subscribe((res: any) => {
      this.loadingService.closeSpinner();
      this.snackBar.open(this.languageService.instant('secure.quality.quality-score.message-send-quality'), this.languageService.instant('actions.close'), {
        duration: 3000,
    });
    });
  }
}
