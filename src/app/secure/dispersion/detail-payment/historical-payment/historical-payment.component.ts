import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar, MatTableDataSource } from '@angular/material';
import { LoadingService } from '@app/core';
import { SupportService } from '@app/secure/support-modal/support.service';
import { TranslateService } from '@ngx-translate/core';
import { DetailPaymentService } from '../detail-payment.service';

@Component({
  selector: 'app-historical-payment',
  templateUrl: './historical-payment.component.html',
  styleUrls: ['./historical-payment.component.scss']
})
export class HistoricalPaymentComponent implements OnInit {

  @Input() sellerData: any;

  public displayedColumns = [
    'datePay',
    'idPayonner',
    'order',
    'seller',
    'description',
    'sale',
    'comission',
    'totalToPay',
  ];

  public arrayPosition = [];
  public dataSource: MatTableDataSource<any>;
  public onlyOne = true;
  public length = 0;
  public limit = 50;
  public paginationToken = '{}';

  constructor(
    private snackBar: MatSnackBar,
    private languageService: TranslateService,
    private loadingService: LoadingService,
    public SUPPORT: SupportService,
    private fb: FormBuilder,
    private detailPaymentService: DetailPaymentService
  ) { }

  ngOnInit() {
    console.log(1, this.sellerData);
    this.getAllListHiistoric();
  }

  /**
   * Funcion para traer el listado del historico de pagos
   * @memberof HistoricalPaymentComponent
   */
  getAllListHiistoric() {
    console.log('entró');
    const url = 'hola';
    this.loadingService.viewSpinner();
    const urlParams = `?limit=${this.limit}&paginationToken=${encodeURI(this.paginationToken)}`;
    const urlFilters = {
      SellerId: this.sellerData.IdSeller.toString(),
      DispersionFilter: {}
    };
    this.detailPaymentService.getAllDetailPayment(urlParams, urlFilters).subscribe((res: any) => {
      if (res && res.status === 200) {
        const { viewModel, count, paginationToken } = res.body;
        // console.log(this.statusAllCheck);
        this.dataSource = new MatTableDataSource(viewModel);
        if (this.onlyOne) {
          this.length = count;
        }
        this.onlyOne = false;
        this.loadingService.closeSpinner();
        this.savePaginationToken(paginationToken);
      } else {
        this.loadingService.closeSpinner();
        this.snackBar.open(this.languageService.instant('public.auth.forgot.error_try_again'), this.languageService.instant('actions.close'), {
          duration: 3000,
        });
      }
    }, error => {
      this.loadingService.closeSpinner();
      this.snackBar.open(this.languageService.instant('public.auth.forgot.error_try_again'), this.languageService.instant('actions.close'), {
        duration: 3000,
      });
    });
  }

  /**
   * Funcion para guardar el paginationtoken
   * @param {string} pagination
   * @memberof HistoricalPaymentComponent
   */
  savePaginationToken(pagination: string) {
    const isExist = this.arrayPosition.includes(pagination);
    if (isExist === false) {
      this.arrayPosition.push(pagination);
    }
  }

}
