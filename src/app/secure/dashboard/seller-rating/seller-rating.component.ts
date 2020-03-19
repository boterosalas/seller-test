import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatDialog, ErrorStateMatcher } from '@angular/material';
import { ComponentsService } from '@app/shared';
import { LoadingService, UserParametersService, ModalService, Logger } from '@app/core';
import { SupportModalComponent } from '@app/secure/support-modal/support-modal.component';
import { DashboardService } from '../services/dashboard.service';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { SupportService } from '@app/secure/support-modal/support.service';
import { TranslateService } from '@ngx-translate/core';

const log = new Logger('SellerRatingComponent');

/**
 *
 * @export
 * @class MyErrorStateMatcher
 * @description Error when invalid control is dirty, touched, or submitted.
 * @implements {ErrorStateMatcher}
 */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}


@Component({
  selector: 'app-seller-rating',
  templateUrl: './seller-rating.component.html',
  styleUrls: ['./seller-rating.component.scss']
})
export class SellerRatingComponent implements OnInit {

  displayedColumns: string[] = ['calification', 'date_calificate', 'date_issued', 'Actions'];
  // dataSource = new MatTableDataSource(ELEMENT_DATA);
  dataSource = new MatTableDataSource();

  public allUser: any;
  public user: any;
  public filterSellerRating: FormGroup;
  public matcher: MyErrorStateMatcher;
  BrandsRegex = { dateMonthYear: '' };

  listFilterBrands = [];
  public paginationToken = '{}';

  validateRegex: any;
  public arrayPosition = [];

  public arraySellerRating: any;
  public scrolled: Boolean = false;
  public disableButton: Boolean = true;

  public paramsGetSellerRating = {
    'sellerId': null,
    'datequalificationinitial': null,
    'dateQualificationFinal': null,
    'generatedDateInitial': null,
    'generatedDateFinal': null,
    'paginationToken': '{}',
    'limit': 10,
  };

  public activeScrolled: Boolean = false;
  sellerId: string;
  activeFilter: Boolean = false;
  appealRating_clasification: any;
  appealRating_sub_clasification: any;
  appealRating: Boolean = true;


  constructor(
    public loadingService: LoadingService,
    public dialog: MatDialog,
    public userParams: UserParametersService,
    public _dashboard: DashboardService,
    public modalService: ModalService,
    public componentsService: ComponentsService,
    public languageService: TranslateService,
    public SUPPORT?: SupportService,
  ) {
    this.getDataUser();

  }

  ngOnInit() {
    this.createFormControls();
    this.validateFormSupport();
    this.getSellerRating();
  }

  /**
   * Metodo para obtener datos del usuario.
   * @memberof SellerRatingComponent
   */
  async getDataUser() {
    this.user = await this.userParams.getUserData();
  }

  /**
   * Evento Scroll q se utiliza para hacer la peticion del filtro
   * @param {*} [event]
   * @memberof SellerRatingComponent
   */
  eventScrollFilter(event?: any) {
    const scrollFilter = Object.assign({}, this.paramsGetSellerRating);
    scrollFilter.paginationToken = this.paginationToken;
    if (this.activeScrolled && scrollFilter.paginationToken !== '{}') {
      if (event.srcElement.scrollHeight === (event.srcElement.offsetHeight + event.srcElement.scrollTop) && !this.scrolled) {
        this.scrolled = true;
        this.loadingService.viewSpinner();
        this._dashboard.getRatingSellers(scrollFilter).subscribe(result => {
          if (result.body) {
            if (result.status === 200 || result.status === 201) {
              this.arraySellerRating = this.arraySellerRating.concat(result.body.viewModel);
              this.dataSource = new MatTableDataSource(this.arraySellerRating);
              this.paginationToken = result.body.paginationToken;
              this.scrolled = false;
              this.loadingService.closeSpinner();
            } else {
              this.modalService.showModal('errorService');
            }
            this.loadingService.closeSpinner();
          } else {
            this.modalService.showModal('errorService');
            this.loadingService.closeSpinner();
          }
        }, error => {
          this.componentsService.openSnackBar(this.languageService.instant('public.auth.forgot.error_try_again'), this.languageService.instant('actions.close'), 4000);
          log.error(error);
        });
      }
    }
  }


  /**
   * Metodo para crear formulario del filtro
   * @memberof SellerRatingComponent
   */
  createFormControls() {
    this.filterSellerRating = new FormGroup({
      datequalificationinitial: new FormControl('', [Validators.pattern(this.BrandsRegex.dateMonthYear)]),
      dateQualificationFinal: new FormControl('', [Validators.pattern(this.BrandsRegex.dateMonthYear)]),
    });
  }

  /**
   * Funcion para cargar datos de regex
   * @memberof SellerRatingComponent
   */
  public validateFormSupport(): void {
    this.SUPPORT.getRegexFormSupport(null).subscribe(res => {
      let dataOffertRegex = JSON.parse(res.body.body);
      dataOffertRegex = dataOffertRegex.Data.filter(data => data.Module === 'dashboard');
      for (const val in this.BrandsRegex) {
        if (!!val) {
          const element = dataOffertRegex.find(regex => regex.Identifier === val.toString());
          this.BrandsRegex[val] = element && `${element.Value}`;
        }
      }
      this.createFormControls();
    });
  }

  /**
   * Metodo que obtiene los primeros datos de calificación
   * @memberof SellerRatingComponent
   */
  getSellerRating() {
    this.loadingService.viewSpinner();
    this.sellerId = localStorage.getItem('userId');
    if (this.sellerId === undefined || this.sellerId === '' || this.sellerId === null || !this.sellerId) {
      this.sellerId = this.user.sellerId;
    }
    this.paramsGetSellerRating.sellerId = localStorage.getItem('userId');
    // this._dashboard.getRatingSellers(this.paramsGetSellerRating).subscribe(result => {
    //   if (result.body) {
    //     if (result.status === 200 || result.status === 201) {
    //       this.arraySellerRating = result.body.viewModel;
    //       this.dataSource = new MatTableDataSource(this.arraySellerRating);
    //       this.savePaginationToken(result.body.paginationToken);
    //     } else {
    //       this.modalService.showModal('errorService');
    //     }
    //     this.loadingService.closeSpinner();
    //   } else {
    //     this.modalService.showModal('errorService');
    //     this.loadingService.closeSpinner();
    //   }
    // }, error => {
    //   this.componentsService.openSnackBar(this.languageService.instant('public.auth.forgot.error_try_again'), this.languageService.instant('actions.close'), 4000);
    //   log.error(error);
    // });
  }

  /**
   * Metodo para ir guardando el pagination token
   * @param {string} paginationToken
   * @memberof SellerRatingComponent
   */
  savePaginationToken(paginationToken: string) {
    if (paginationToken) {
      this.paginationToken = paginationToken;
    }
  }

  /**
   * Metodo para capturar la fecha y cambiar el formato
   * @param {string} valueDate
   * @returns
   * @memberof SellerRatingComponent
   */
  formtDateYearMonth(valueDate: string) {
    if (valueDate && valueDate.includes('/')) {
      const arrayDate = valueDate.split('/');
      return arrayDate[1] + arrayDate[0];
    }
  }

  /**
   * Metodo para comparar rango de fechas para el filtro.
   * @memberof SellerRatingComponent
   */
  compareDate() {
    // this.disableButton = false;
    const initial = this.formtDateYearMonth(this.filterSellerRating.controls.datequalificationinitial.value);
    const final = this.formtDateYearMonth(this.filterSellerRating.controls.dateQualificationFinal.value);
    if (+initial > +final) {
      this.disableButton = true;
      this.componentsService.openSnackBar(this.languageService.instant('secure.products.create_product_unit.list_products.date_must_no_be_initial_date'), this.languageService.instant('actions.close'), 5000);
    } else {
      this.disableButton = false;
    }
  }

  /**
   * Metodo apra filtrar la calificacion segun fecha de emisión
   * @memberof SellerRatingComponent
   */
  getFilterSellerRating() {
    this.activeScrolled = true;
    this.scrolled = false;
    this.loadingService.viewSpinner();

    const filterSellerRating = Object.assign({}, this.paramsGetSellerRating);
    const dateInitial = this.formtDateYearMonth(this.filterSellerRating.controls.datequalificationinitial.value);
    const dateFinal = this.formtDateYearMonth(this.filterSellerRating.controls.dateQualificationFinal.value);

    filterSellerRating.datequalificationinitial = dateInitial;
    filterSellerRating.dateQualificationFinal = dateFinal;

    this.loadingService.viewSpinner();
    this._dashboard.getRatingSellers(filterSellerRating).subscribe(result => {
      this.dataSource = null;
      this.arraySellerRating = result.body.viewModel;
      if (result.status === 200 || result.status === 201) {
        if (this.arraySellerRating) {
          this.dataSource = new MatTableDataSource(result.body.viewModel);
          this.savePaginationToken(result.body.paginationToken);
          this.activeFilter = false;
        } else {
          this.activeFilter = true;
        }

      }
      this.loadingService.closeSpinner();
    });
  }

  /**
   * Metodo para abrir el modal de formulario de soporte para apelación
   * @memberof SellerRatingComponent
   */
  openDialogSupport(): void {
    this.loadingService.viewProgressBar();
    const dialogRef = this.dialog.open(SupportModalComponent, {
      width: '90%',
      panelClass: 'full-width-dialog',
      data: this.appealRating
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadingService.closeProgressBar();
    });
  }

  /**
   * metodo para abrir pdf en nueva ventana para su descarga
   * @param {*} model
   * @memberof SellerRatingComponent
   */
  public getPDF(model: any): void {
    window.open(model.urlFile, '_blank');
  }

  /**
   * Metodo apra limpiar aprametros del filtro.
   * @memberof SellerRatingComponent
   */
  cleanAllFilter() {
    this.filterSellerRating.reset({ datequalificationinitial: '', dateQualificationFinal: '' });
    this.listFilterBrands = [];
    this.getSellerRating();
    this.activeScrolled = false;
    this.activeFilter = false;
  }

}
