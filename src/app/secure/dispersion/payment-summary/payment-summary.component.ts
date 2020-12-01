import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { InformationToForm, SearchFormEntity } from '@app/shared';
import { DispersionService } from '../dispersion.service';

@Component({
  selector: 'app-payment-summary',
  templateUrl: './payment-summary.component.html',
  styleUrls: ['./payment-summary.component.scss']
})
export class PaymentSummaryComponent implements OnInit {

  public selection = new SelectionModel<any>(true, []);
  public filter: any;
  public limit= 10;
  public paginationToken = '{}';
  public newLimit = null;
  public currentPage = 0;

  public informationToForm: SearchFormEntity = {
    title: 'module.Dispersion',
    subtitle: 'menu.Resumen de pagos',
    btn_title: 'dispersión',
    title_for_search: 'Filtros',
    type_form: 'module',
    information: new InformationToForm,
    count: null
  };

  public displayedColumns = [
    'check',
    'cutoffDate',
    'idSeller',
    'seller',
    'quantityOrders',
    'idInternalCode',
    'description',
    'totalToPay'
  ];

  public btnFilter = true;


  constructor(
    private dispersionService: DispersionService,
  ) {
    // this.filter = {
    //   'CutOffDate': null,
    //   'InternalPaymentId': null,
    //   'PaymentDate': null,
    //   'PaginationToken': '{}',
    //   'Limit': this.limit,
    //   'NewLimit': null,
    //   'CurrentPage': 0
    // };
    this.filter = `limit=${this.limit}&paginationToken=${encodeURI(this.paginationToken)}&NewLimit=${this.newLimit}&CurrentPage=${this.currentPage}`;
   }

  ngOnInit() {
    this.getAllPaymentSummary();
  }

  getAllPaymentSummary() {
    this.dispersionService.getAllPaymentSummary(this.filter).subscribe((res: any) => {
      console.log(res);
    });
  }

  toggleFilterReportPaymentSummary() {
    console.log('invoca el filtro');
  }

}
