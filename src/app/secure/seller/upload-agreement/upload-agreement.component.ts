import { Component, OnInit, ViewChild } from '@angular/core';
import { Logger, LoadingService,  } from '@app/core';
import { MatSidenav,  MatDialog, MatTableDataSource } from '@angular/material';
import {  SearchFormEntity, InformationToForm } from '@app/shared';
import { AuthService } from '@app/secure/auth/auth.routing';
import { SelectionModel } from '@angular/cdk/collections';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ModalLoadAgreementComponent } from '../modal-load-agreement/modal-load-agreement.component';
import { SellerService } from '../seller.service';
import { ShellComponent } from '@app/core/shell';

const log = new Logger('ManageSellerComponent');
@Component({
  selector: 'app-upload-agreement',
  templateUrl: './upload-agreement.component.html',
  styleUrls: ['./upload-agreement.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('void', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('*', style({ height: '*', visibility: 'visible' })),
      transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class UploadAgreementComponent implements OnInit {


  public statusAllCheck = true;
  public arrayNotSelect = [];
  public subModalLoad: any;
  public limit = 50;
  public resultModel: any;
  public disabledBtn = false;


  public callOne = true;
  public arrayPosition = [];
  public paginationToken = '{}';
  public arraySelect = [];
  public all = false;
  public disabledCheckTempor = false;
  public isAllSelectedCurrent = false;

  @ViewChild('sidenav', {static: false}) sidenav: MatSidenav;
  public dataSource: MatTableDataSource<any>;
  public selection = new SelectionModel<any>(true, []);
  public initialSellerList: any;
  public mapInitialSellerList: any;
  public length = 0;
  public displayedColumns = [
    'all',
    'id',
    'nit',
    'name',
  ];

  // Configuración para el toolbar-options y el search de la pagina
  public informationToForm: SearchFormEntity = {
    title: 'secure.seller.list.toolbar_title',
    subtitle: 'menu.Cargar Acuerdos',
    btn_title: 'secure.orders.filter.title',
    title_for_search: 'secure.orders.filter.title',
    type_form: 'orders',
    information: new InformationToForm,
    count: null
  };

  constructor(
    private dialog: MatDialog,
    public authService: AuthService,
    private sellerService: SellerService,
    public shellComponent: ShellComponent,
    public loadingService: LoadingService,
  ) { }

  ngOnInit() {
    this.getAllSeller();
    this.clearData();
  }
  /**
   * funcion para capturar todos los seller paginados
   *
   * @param {*} [params]
   * @memberof UploadAgreementComponent
   */
  getAllSeller(params?: any) {
    this.loadingService.viewSpinner();
    if (params === undefined) {
      params = {
        limit: this.limit + '&paginationToken=' + encodeURI(this.paginationToken),
      };
    }
    this.sellerService.getAllSellersPaginated(params).subscribe((result: any) => {
      if (result) {
        this.resultModel = JSON.parse(result.body);
        if (this.callOne) {
          this.length = this.resultModel.Count;
          this.arrayPosition = [];
          this.arrayPosition.push('{}');
          this.callOne = false;
        }
        this.dataSource = new MatTableDataSource(this.resultModel.ViewModel);
        if (this.arraySelect.length > 0) {
          this.arraySelect.forEach(select => {
            this.dataSource.data.forEach(rowGen => {
              if (rowGen.Id === select.Id) {
                this.selection.select(rowGen);
              }
            });
          });
        }
        if (this.all) {
          this.dataSource.data.forEach(row => this.selection.select(row));
        }

        if (this.arrayNotSelect.length > 0) {
          this.arrayNotSelect.forEach(select => {
            this.dataSource.data.forEach(rowGen => {
              if (rowGen.Id === select.Id) {
                this.selection.deselect(rowGen);
              }
            });
          });
        }
        this.paginationToken = this.resultModel.PaginationToken ? this.resultModel.PaginationToken : '{}';
        this.loadingService.closeSpinner();
      } else {
        this.loadingService.closeSpinner();
      }
    });
  }
  /**
   * funcion para paginar el listado de seller
   *
   * @param {*} event
   * @memberof UploadAgreementComponent
   */
  paginations(event: any) {
    if (event.param.pageSize !== this.limit) {
      this.limit = event.param.pageSize;
      this.allClear();
    }
    if (event && event.param && event.param.pageIndex >= 0) {
      const index = event.param.pageIndex;
      if (index === 0) {
        this.paginationToken = '{}';
      }
      const isExistInitial = this.arrayPosition.includes('{}');
      if (isExistInitial === false) {
        this.arrayPosition.push('{}');
      }
      const isExist = this.arrayPosition.includes(this.paginationToken);
      if (isExist === false) {
        this.arrayPosition.push(this.paginationToken);
      }
      this.paginationToken = this.arrayPosition[index];
      if (this.paginationToken === undefined) {
        this.paginationToken = '{}';
      }
      const params = {
        'limit': this.limit + '&paginationToken=' + encodeURI(this.paginationToken),
      };
      this.getAllSeller(params);
    }
  }

  /**
   * funcion para abrir el modal cargar acuerdos
   *
   * @memberof UploadAgreementComponent
   */
  importAgreement() {
    const dialogRef = this.dialog.open(ModalLoadAgreementComponent, {
      width: '50%',
      minWidth: '280px',
      data: {
        selectAll: !this.statusAllCheck,
        arraySelect: this.arraySelect,
        arrayNotSelect: this.arrayNotSelect
      }
    });
  }

  /**
   * funcion para validar todos los check del listado
   *
   * @memberof UploadAgreementComponent
   */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    if (numSelected === numRows) {
      this.isAllSelectedCurrent = true;
    } else {
      this.isAllSelectedCurrent = false;
    }
    if (this.arraySelect.length === 0 && !this.all) {
      this.selection.clear();
      this.all = false;
      this.statusAllCheck = true;
    }
  }

  /**
   * funcion para manejar el check all
   *
   * @param {boolean} status
   * @memberof UploadAgreementComponent
   */
  masterToggle(status: boolean) {
    if (status) {
      if (this.selection.selected.length > 0) {
        this.selection.clear();
        this.arraySelect = [];
        this.statusAllCheck = true;
      } else {
        this.dataSource.data.forEach(row => this.selection.select(row));
        this.statusAllCheck = !status;
      }
    } else {
      this.selection.clear();
      this.arraySelect = [];
      this.statusAllCheck = !status;
    }
  }
  /**
   * funcion para cambiar stados de los check
   *
   * @param {*} row
   * @param {*} status
   * @memberof UploadAgreementComponent
   */
  public changeStatus(row: any, status: any) {
    this.disabledBtn = true;
    if (row) {
      if (status) {
        this.arraySelect.push(row);
        this.disabledBtn = false;
      } else {
        const index = this.arraySelect.findIndex(rows => rows.Id === row.Id);
        this.arraySelect.splice(index, 1);
        this.selection.deselect(row);
      }
      if (!this.statusAllCheck) {
        if (status) {
          const index = this.arrayNotSelect.findIndex(rows => rows === row);
          this.arrayNotSelect.splice(index, 1);
          this.selection.deselect(row);
        } else {
          this.arrayNotSelect.push(row);
          this.disabledBtn = false;
        }
      } else {
        this.arrayNotSelect = [];
      }
    } else {
      this.all = status;
      this.disabledBtn = false;
    }

    this.isAllSelected();
  }
  /**
   * funcion para limpiar la data, un evento emitido para accionar la respuesta de limpiado
   *
   * @memberof UploadAgreementComponent
   */
  clearData() {
    this.subModalLoad = this.shellComponent.eventEmitterOrders.clearTable.subscribe(
      (data: any) => {
        this.allClear();
      });
  }

  allClear() {
    this.paginationToken = '{}';
    this.arrayNotSelect = [];
    this.arraySelect = [];
    this.arrayPosition = [];
    this.all = false;
    this.getAllSeller(undefined);
    this.selection.clear();
    this.dialog.closeAll();
    this.statusAllCheck = true;
  }
  toggleFilterPorts() {}
}
