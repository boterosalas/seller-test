import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-detail-calification',
  templateUrl: './detail-calification.component.html',
  styleUrls: ['./detail-calification.component.scss']
})
export class DetailCalificationComponent implements OnInit {

  @Input() detailByElemet: any;
  @Input() nameSeller: string;
  @Input() idSeller: any;

  public colorCalificationPromiseDelivery = 'default';
  public colorCalificationCase = 'default';
  public colorCalificationCanceled = 'default';
  public setFormatDateInfoSellerMonthQuality = '';
  public setFormatDateInfoSellerGenrateDate = '';

  public penaltyOutSideDelivery = 0;
  public penaltyCanceledBySeller = 0;
  public penaltyTotal = 0;

  public monthEN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  public monthES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];



  constructor() { }

  ngOnInit() {
    this.setDetailsBySeller();
  }

  setDetailsBySeller() {
    this.sumatoryPenality(this.detailByElemet.Detail);
    this.colorCalificationPromiseDelivery = this.setClassColorByCalification(this.detailByElemet.QualificationPromiseDelivery.Qualification);
    this.colorCalificationCase = this.setClassColorByCalification(this.detailByElemet.QualificationCase.Qualification);
    this.colorCalificationCanceled = this.setClassColorByCalification(this.detailByElemet.QualificationCanceled.Qualification);
    this.setFormatDateInfoSellerMonthQuality = this.formatNameMonth(this.detailByElemet.QualificationDate);
    this.setFormatDateInfoSellerGenrateDate = this.formatNameMonth(this.detailByElemet.GeneratedDate);
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
    if( details.OrdersOutsideDeliveryDate && details.OrdersOutsideDeliveryDate.length > 0){
       details.OrdersOutsideDeliveryDate.forEach(element => {
      this.penaltyOutSideDelivery += element.Penalty
    });
    }
    if (details.OrdersOutsideDeliveryDate && details.OrdersCanceledBySellerResponsibility.length > 0){
       details.OrdersCanceledBySellerResponsibility.forEach(element => {
      this.penaltyCanceledBySeller += element.Penalty
    });
    }
    this.penaltyTotal = this.penaltyOutSideDelivery + this.penaltyCanceledBySeller;
  }

  // EMITIR LOS EVENTOS
  backTolist() {
    // this.showContainerDetail = false;
  }


}
