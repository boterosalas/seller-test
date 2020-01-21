import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/secure/auth/auth.routing';
import { UserInformation, StateEntity, CitiesEntity } from '@app/shared';
import { MenuModel, citiesCoverageName } from '@app/secure/auth/auth.consts';
import { UserParametersService, LoadingService, ModalService } from '@app/core';
import { StatesService } from '@app/shared/components/states/states.service';
import { CitiesServices } from '@app/shared/components/cities/cities.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatSnackBar } from '@angular/material';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CitiesCoverageService } from '../cities-coverage.service';
import { distinct } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-cities-coverage',
  templateUrl: './cities-coverage.component.html',
  styleUrls: ['./cities-coverage.component.scss'],
  // Configuración para la páginación de la tabla animations:
  animations: [
    trigger('detailExpand', [
      state('void', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('*', style({ height: '*', visibility: 'visible' })),
      transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})
export class CitiesCoverageComponent implements OnInit {

  public user: UserInformation;
  public permissionComponent: MenuModel;
  public typeProfile: number;

  /** Lista de departamentos */
  public states: any;
  /** Departamento seleccionado (Nombre) */
  public stateSelected: string;
  /** */
  public daneCodesNonCoverage: string[] = [];

  /** Mapea las columnas a mostrar en la tabla */
  public shownColumns: string[] = ['select', 'department', 'city'];
  /** DataSource del listado de Ciudades */
  public dataSource: MatTableDataSource<CitiesEntity>;
  /** Modelo de ciudades selecciondas */
  public selection = new SelectionModel<CitiesEntity>(true, []);

  /**
   * Creates an instance of CitiesCoverageComponent.
   * @param {AuthService} __authService
   * @param {UserParametersService} __userParams
   * @param {StatesService} __stateService
   * @param {CitiesServices} __citiesService
   * @param {LoadingService} __loadingService
   * @memberof CitiesCoverageComponent
   */
  constructor(
    private __authService: AuthService,
    private __userParams: UserParametersService,
    // private __stateService: StatesService,
    private __stateService: CitiesServices,
    private __citiesService: CitiesServices,
    private __loadingService: LoadingService,
    private __citiesCoverage: CitiesCoverageService,
    private modalService: ModalService,
    private snackBar: MatSnackBar,
    private languageService: TranslateService,
  ) { }

  ngOnInit() {
    this.getDataUser();
    this.getDepartments();
  }

  /**
   *
   *
   * @private
   * @memberof CitiesCoverageComponent
   */
  private async getDataUser() {
    this.user = await this.__userParams.getUserData();
    if (this.user.sellerProfile === 'seller') {
      this.permissionComponent = this.__authService.getMenuProfiel(citiesCoverageName, 0);
      this.typeProfile = 0;
    } else {
      this.permissionComponent = this.__authService.getMenuProfiel(citiesCoverageName, 1);
      this.typeProfile = 1;
    }
  }

  /**
   * Consume el servicio de departamentos y los lista en el select
   *
   * @memberof CitiesCoverageComponent
   */
  public getDepartments(): void {
    this.__loadingService.viewSpinner();
    this.__stateService.getCitiesCoverage().subscribe(data => {
      const states2 = [new Set(data.map(x => x.State))];
      this.states = states2[0];
      this.__loadingService.closeSpinner();
    });
    this.__citiesCoverage.getDaneCodesNonCoverage().subscribe(data => {
      const noCoverage = JSON.parse(data['body']);
      this.daneCodesNonCoverage = noCoverage.Data.DaneCodesNonCoverage;
    });
  }


  /**
   * Consume el servicio de ciudades segun el departamento seleccionado
   * luego lo lista en la tabla
   *
   * @param {CitiesEntity} city
   * @memberof CitiesCoverageComponent
   */
  public getCities(stateSelected: String): void {
    this.__loadingService.viewSpinner();
    this.__citiesService.getCitiesCoverage().subscribe(data => {
      this.selection.clear();
      this.dataSource = new MatTableDataSource([]);
      if (data.length) {
        // tslint:disable-next-line:no-shadowed-variable
        data = data.map((city) => {
          const obj = Object.assign({}, city);
          obj.Status = !this.daneCodesNonCoverage.includes(city.DaneCode);
          return obj;
        }).filter((el => el.State === stateSelected));
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.data.forEach((row: CitiesEntity) => (row.Status) && this.selection.select(row));
        // this.dataSource.data.forEach((row: CitiesEntity) => this.selection.select(row));
      }
    }, (err) => { console.error(err); }, () => this.__loadingService.closeSpinner());
  }

  /**
   * Valida si todas los checkbox de la tabla han sido seleccionados
   *
   * @private
   * @returns {boolean}
   * @memberof CitiesCoverageComponent
   */
  private isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /**
   * Selecciona todas las filas del checkbox de la tabla
   *
   * @memberof CitiesCoverageComponent
   */
  public masterToggle(): void {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /**
   * Guarda las ciudades
   *
   * @param {CitiesEntity[]} cities
   * @memberof CitiesCoverageComponent
   */
  public saveCities(cities: any): void {
    this.__loadingService.viewSpinner();
    const sendDaneCode = {
      'DaneCodesNonCoverage': []
    };
    const uncheckCity = this.dataSource.data.filter(el => -1 === cities.indexOf(el));
    uncheckCity.forEach(element => {
      sendDaneCode['DaneCodesNonCoverage'].push(element.DaneCode);
    });

    this.__citiesCoverage.pacthCitiesNoCoverage(sendDaneCode).subscribe((result: any) => {
      if (result.status === 200 || result.status === 201) {
        const data = JSON.parse(result.body.body);
        if (data && data.Errors.length > 0) {
          this.snackBar.open(this.languageService.instant('secure.offers.cities_coverage.save_daneCode_ko'), this.languageService.instant('actions.close'), {
            duration: 5000,
          });
        } else {
          this.snackBar.open(this.languageService.instant('secure.offers.cities_coverage.save_daneCode_ok'), this.languageService.instant('actions.close'), {
            duration: 5000,
          });
          window.location.reload();
        }
      } else {
        this.modalService.showModal('errorService');
      }
      this.__loadingService.closeSpinner();
    });
  }
}
