import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/secure/auth/auth.routing';
import { UserInformation, StateEntity, CitiesEntity } from '@app/shared';
import { MenuModel, citiesCoverageName } from '@app/secure/auth/auth.consts';
import { UserParametersService, LoadingService } from '@app/core';
import { StatesService } from '@app/shared/components/states/states.service';
import { CitiesServices } from '@app/shared/components/cities/cities.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material';
import { trigger, state, style, transition, animate } from '@angular/animations';

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
  public states: StateEntity[];
  /** Departamento seleccionado (Nombre) */
  public stateSelected: string;

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
    private __stateService: StatesService,
    private __citiesService: CitiesServices,
    private __loadingService: LoadingService
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
    this.__stateService.getDepartments().subscribe(data => { this.states = data; this.__loadingService.closeSpinner(); });
  }

  /**
   * Consume el servicio de ciudades segun el departamento seleccionado
   * luego lo lista en la tabla
   *
   * @param {CitiesEntity} city
   * @memberof CitiesCoverageComponent
   */
  public getCities(city: CitiesEntity): void {
    this.__loadingService.viewSpinner();
    this.__citiesService.getCities(city.Id).subscribe(data => {
      console.table(data);
      this.selection.clear();
      this.dataSource = new MatTableDataSource(data);
      if (data.length) {
        this.stateSelected = city.Name;
        this.dataSource.data.forEach((row: CitiesEntity) => this.selection.select(row));
      }
    }, (err) => { console.error(err) }, () => this.__loadingService.closeSpinner());
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
  public saveCities(cities: CitiesEntity[]): void {
    console.log(cities);
  }
}
