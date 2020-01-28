import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { RoutesConst } from '@app/shared';
import { LoadingService, UserParametersService } from '@app/core';
import { SupportModalComponent } from '@app/secure/support-modal/support-modal.component';
import { DashboardService } from '../services/dashboard.service';
import { MyProfileService } from '@app/secure/aws-cognito/profile/myprofile.service';

export interface Calification {
  calification: string;
  date_calificate: string;
  date_issued: string;
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

  constructor(
    private router: Router,
    private loadingService: LoadingService,
    public dialog: MatDialog,
    private profileService: MyProfileService,
    private userParams: UserParametersService,
    private _dashboard: DashboardService,
  ) {
    // this.getAllDataUser();
    this.getDataUser();
  }

  ngOnInit() {
    // this.getDataUser();
    this.getSellerRating();
  }

  async getDataUser() {
    this.user = await this.userParams.getUserData();
    // console.log('this.user :' , this.user.sellerId );
  }

  // async getAllDataUser() {
  //   // console.log('hola');
  //   this.loadingService.viewSpinner();
  //   const sellerData = await this.profileService.getUser().toPromise().then(res => {
  //     const body: any = res.body;
  //     const response = JSON.parse(body.body);
  //     const userData = response.Data;
  //     console.log('userData', userData);
  //     this.allUser = userData;
  //     this.loadingService.closeSpinner();
  //     return userData;
  //   });
  // }

  getSellerRating() {
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

    console.log('paramsGetFilter:', paramsArray);

    this._dashboard.getRatingSellers(paramsArray).subscribe(result => {
      console.log('result: ', result);
      this.dataSource = new MatTableDataSource(result.viewModel);
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

}
