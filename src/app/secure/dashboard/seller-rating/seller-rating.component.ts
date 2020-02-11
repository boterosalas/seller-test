import { Component, OnInit, HostListener } from '@angular/core';
import { MatTableDataSource, MatDialog, ErrorStateMatcher } from '@angular/material';
import { Router } from '@angular/router';
import { RoutesConst } from '@app/shared';
import { LoadingService, UserParametersService, ModalService } from '@app/core';
import { SupportModalComponent } from '@app/secure/support-modal/support-modal.component';
import { DashboardService } from '../services/dashboard.service';
import { MyProfileService } from '@app/secure/aws-cognito/profile/myprofile.service';
import { FormGroup, FormBuilder, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { SupportService } from '@app/secure/support-modal/support.service';

// export interface Calification {
//   calification: string;
//   date_calificate: string;
//   date_issued: string;
// }

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
  private scrolled: Boolean = false;

  public paramsGetSellerRating = {
    'sellerId': null,
    'datequalificationinitial': null,
    'dateQualificationFinal': null,
    'generatedDateInitial': null,
    'generatedDateFinal': null,
    'paginationToken': '{}',
    'limit': 10,
  };

  private activeScrolled: Boolean = false;
  sellerId: string;
  activeFilter: Boolean = false;
  appealRating_clasification: any;
  appealRating_sub_clasification: any;
  appealRating: any;


  constructor(
    private loadingService: LoadingService,
    public dialog: MatDialog,
    private userParams: UserParametersService,
    private _dashboard: DashboardService,
    private modalService: ModalService,
    public SUPPORT?: SupportService,
  ) {
    // this.getAllDataUser();
    this.getDataUser();

  }

  ngOnInit() {
    // this.paramsGetSellerRating.sellerId = localStorage.getItem('userId');
    this.createFormControls();
    this.validateFormSupport();
    this.getSellerRating();
    // this.getCaseEvaluation();
    // this.prueba();
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
          console.log('res: ', result);
          // const a = [{
          //   idSeller: 11811,
          //   qualificationDate: 202012,
          //   generatedDate: 20201227,
          //   urlFile: 'https://s3.amazonaws.com/seller.center.exito.seller/qualificationDev/1234_Noviembre_2019_spanish.html',
          //   qualitative: 'Deficiente'
          // },
          // {
          //   idSeller: 11811,
          //   qualificationDate: 202012,
          //   generatedDate: 20201227,
          //   urlFile: 'https://s3.amazonaws.com/seller.center.exito.seller/qualificationDev/1234_Noviembre_2019_spanish.html',
          //   qualitative: 'Deficiente'
          // }];
          this.arraySellerRating = this.arraySellerRating.concat(result.body.viewModel);
          this.dataSource = new MatTableDataSource(this.arraySellerRating);
          this.paginationToken = result.body.paginationToken;
          this.scrolled = false;
          this.loadingService.closeSpinner();
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

  // Funcion para cargar datos de regex
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
    this._dashboard.getRatingSellers(this.paramsGetSellerRating).subscribe(result => {
      if (result.status === 200 || result.status === 201) {
        this.arraySellerRating = result.body.viewModel;
        this.dataSource = new MatTableDataSource(this.arraySellerRating);
        this.savePaginationToken(result.body.paginationToken);
      } else {
        this.modalService.showModal('errorService');
      }
      this.loadingService.closeSpinner();
    });
    // this.getCaseEvaluation();
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
   * Metodo apra filtrar la calificacion segun fecha de emisión
   * @memberof SellerRatingComponent
   */
  getFilterSellerRating() {
    this.activeScrolled = true;
    this.scrolled = false;
    this.loadingService.viewSpinner();

    const filterSellerRating = Object.assign({}, this.paramsGetSellerRating);
    const dateInitial = this.formtDateYearMonth(this.filterSellerRating.controls.datequalificationinitial.value);
    // const dateInitial = this.filterSellerRating.controls.datequalificationinitial.value.replace('/', '');
    // const dateFinal = this.filterSellerRating.controls.dateQualificationFinal.value.replace('/', '');
    const dateFinal = this.formtDateYearMonth(this.filterSellerRating.controls.dateQualificationFinal.value);


    filterSellerRating.datequalificationinitial = dateInitial;
    filterSellerRating.dateQualificationFinal = dateFinal;

    this.loadingService.viewSpinner();
    console.log('filterSellerRating', filterSellerRating);
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
      // this.dataSource = new MatTableDataSource(result.body.viewModel);
      // this.savePaginationToken(result.body.paginationToken);
      this.loadingService.closeSpinner();
    });
  }

  getCaseEvaluation() {
    this.SUPPORT.getClassification().subscribe(categories => {
        let ratingCategorie = categories.data;
        ratingCategorie = ratingCategorie.filter(el => el.idMatrix === 'MT499');
        this.appealRating_clasification = ratingCategorie.classification;
        this.appealRating_sub_clasification = ratingCategorie.category;
        this.appealRating = [this.appealRating_clasification, this.appealRating_sub_clasification];
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
