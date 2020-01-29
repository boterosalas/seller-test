import { Component, OnInit, HostListener } from '@angular/core';
import { MatTableDataSource, MatDialog, ErrorStateMatcher } from '@angular/material';
import { Router } from '@angular/router';
import { RoutesConst } from '@app/shared';
import { LoadingService, UserParametersService } from '@app/core';
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


  validateRegex: any;

  constructor(
    private router: Router,
    private loadingService: LoadingService,
    public dialog: MatDialog,
    private profileService: MyProfileService,
    private userParams: UserParametersService,
    private _dashboard: DashboardService,
    private fb?: FormBuilder,
    public SUPPORT?: SupportService,
  ) {
    // this.getAllDataUser();
    this.getDataUser();
  }

  ngOnInit() {
    this.createFormControls();
    this.validateFormSupport();
    this.getSellerRating();
    this.prueba();
  }

  async getDataUser() {
    this.user = await this.userParams.getUserData();
    // console.log('this.user :' , this.user.sellerId );
  }

  prueba() {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const scrolled1 = window.scroll;
      const scrolled2 = window.scrollX;
      const scrolled3 = window.scrollbars;
      const scrolled4 = window.top;
      const scrolled5 = window.screenTop;
      // const scrolled6 = window.scrollY;
      console.log('scrolled: ', scrolled);
      console.log('scrolled1: ', scrolled1);
      console.log('scrolled2: ', scrolled2);
      console.log('scrolled3: ', scrolled3);
      console.log('scrolled4: ', scrolled4);


      console.log('scrolled5: ', scrolled5);
    });

  }

  createFormControls() {
    // this.filterSellerRating = this.fb.group({
    //   datequalificationinitial: new FormControl('', Validators.compose([Validators.pattern(this.getValue('dateMonthYear'))])),
    //   dateQualificationFinal: new FormControl('', Validators.compose([Validators.pattern(this.getValue('dateMonthYear'))])),
    //     matcher: new MyErrorStateMatcher()
    // });
    this.filterSellerRating = new FormGroup({
      datequalificationinitial: new FormControl('', [Validators.pattern(this.BrandsRegex.dateMonthYear)]),
      dateQualificationFinal: new FormControl('', [Validators.pattern(this.BrandsRegex.dateMonthYear)]),
      // matcher: new MyErrorStateMatcher()
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

  getSellerRating() {
    this.loadingService.viewSpinner();
    console.log('this.allUser: ', this.allUser);
    const sellerId = 11618;
    // paramsGetFilter = `${11618}/${null}/${null}/${null}/${null}/${null}/${10}`;

    const paramsArray = {
      'sellerId': this.user.sellerId,
      'datequalificationinitial': null,
      'dateQualificationFinal': null,
      'generatedDateInitial': null,
      'generatedDateFinal': null,
      'paginationToken': null,
      'limit': 10,
    };

    this._dashboard.getRatingSellers(paramsArray).subscribe(result => {
      console.log('result: ', result);
      this.dataSource = new MatTableDataSource(result.body.viewModel);
      this.loadingService.closeSpinner();
    });
  }

  getFilterSellerRating() {
    this.loadingService.viewSpinner();

    const dateInitial = this.filterSellerRating.controls.datequalificationinitial.value.replace('/', '');
    const dateFinal = this.filterSellerRating.controls.dateQualificationFinal.value.replace('/', '');

    this.loadingService.viewSpinner();
    const paramsArray = {
      'sellerId': this.user.sellerId,
      'datequalificationinitial': dateInitial,
      'dateQualificationFinal': dateFinal,
      'generatedDateInitial': null,
      'generatedDateFinal': null,
      'paginationToken': null,
      'limit': null,
    };
    console.log('paramsGetFilter:', paramsArray);

    this._dashboard.getRatingSellers(paramsArray).subscribe(result => {
      console.log('result:', result);
      this.dataSource = new MatTableDataSource(result.body.viewModel);
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
      panelClass: 'full-width-dialog'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadingService.closeProgressBar();
    });
  }

  public getPDF(model: any): void {
    window.open(model.urlFile, '_blank');
  }

  cleanAllFilter() {
    this.filterSellerRating.reset({ datequalificationinitial: '', dateQualificationFinal: '' });
    this.listFilterBrands = [];
    this.getSellerRating();
  }

}
