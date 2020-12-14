import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher, MatDialog, MatSidenav, MatSnackBar, MatTableDataSource } from '@angular/material';
import { StoreModel } from '@app/secure/offers/stores/models/store.model';
import { StoresService } from '@app/secure/offers/stores/stores.service';
import { InformationToForm, SearchFormEntity } from '@app/shared';
import { ModalDonwloadEmailComponent } from '@app/shared/components/modal-donwload-email/modal-donwload-email.component';
import { EventEmitterSeller } from '@app/shared/events/eventEmitter-seller.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { ReportCommissionService } from './report-commission.service';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { Moment} from 'moment';
import { LoadingService } from '@app/core';
import { SupportService } from '@app/secure/support-modal/support.service';
import { TranslateService } from '@ngx-translate/core';

/**
 * exporta funcion para mostrar los errores de validacion del formulario
 *
 * @export
 * @class MyErrorStateMatcher
 * @implements {ErrorStateMatcher}
 */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

const moment =  _moment;

@Component({
  selector: 'app-report-commission',
  templateUrl: './report-commission.component.html',
  styleUrls: ['./report-commission.component.scss']
})
export class ReportCommissionComponent implements OnInit {

  // Configuración para el toolbar-options y el search de la pagina
  public informationToForm: SearchFormEntity = {
    title: 'Reportes',
    subtitle: 'menu.Reporte de comisiones',
    btn_title: 'Reportes',
    title_for_search: 'Filtros reporte',
    type_form: 'report',
    information: new InformationToForm,
    count: null
  };

  isClear = false;
  lastState: 0;
  length = 0;
  public limit= 50;
  indexPage = 0;
  showTable = false;
  dateInitLimit = '';

  public filterDateInit: any;
  public filterDateEnd: any;
  public user: any;
  public filter: any;

  public btnDownload = true;
  public btnFilter = true;
  public stateSideNavOrder = false;
  public textForSearch: FormControl;
  public filteredOptions: Observable<string[]>;
  public listSellers: any;
  keywords: Array<any> = [];
  public arrayPosition = [];
  arrayNotas = [];
  invalidAdmin: Boolean = false;
  validateKey = true;
  idAdmin: any;
  nameAdmin: string;
  listCommission2: any;
  listCommission: any;
  invalidCommission: Boolean = true;
  @ViewChild('toolbarOptions') toolbarOption;
  dataSource: MatTableDataSource<any>;
  loadListAdmin = true;
  onlyOne= true;
  dataDisabled = true;
  CommissionRegex = { integerNumber: '', formatNumerHours: '', onlyLetter: '' };
  listCommissionAll = [];
  validateInput = true;
  filterChips = [];

  public filterCommission: FormGroup;

  @ViewChild('sidenavSearchCommission') sidenavSearchCommission: MatSidenav;

  public displayedColumns = [
    'Plu',
    'Brand',
    'EAN',
    'IdSeller',
    'DateInitial',
    'DateEnd',
    'Commission',
    'Admin',
    'DateAction'
  ];


  constructor(
    public eventsSeller: EventEmitterSeller,
    public storeService: StoresService,
    private loadingService: LoadingService,
    public dialog: MatDialog,
    public SUPPORT: SupportService,
    private languageService: TranslateService,
    public reportCommissionService: ReportCommissionService,
    private fb: FormBuilder,
    public snackBar?: MatSnackBar,
  ) {
    this.textForSearch = new FormControl();
    this.listSellers = [];
    this.user = {};
    this.filter = {
      'IdSeller': null,
      'Plu': null,
      'Brand': null,
      'InitialDate': null,
      'FinalDate': null,
      'SellerAudit': null,
      'PaginationToken': '{}',
      'Limit': this.limit,
      'NewLimit': null,
      'CurrentPage': 0
    };
    this.arrayPosition = [];
    this.arrayPosition.push('{}');
  }

  ngOnInit() {
    this.getSellerList();
    this.createFormControls();
    this.getListCommissionAll();
    this.getRegexByModule();
  }

/**
 * funcion para consultar las regex
 *
 * @memberof ReportCommissionComponent
 */
public getRegexByModule(): void {
    this.SUPPORT.getRegexFormSupport(null).subscribe(res => {
      let dataCommissionRegex = JSON.parse(res.body.body);
      dataCommissionRegex = dataCommissionRegex.Data.filter(data => data.Module === 'productos' || data.Module === 'vendedores' || data.Module === 'transversal');
      for (const val in this.CommissionRegex) {
        if (!!val) {
          const element = dataCommissionRegex.find(regex => regex.Identifier === val.toString());
          this.CommissionRegex[val] = element && `${element.Value}`;
        }
      }
      this.createFormControls();
    });
  }


/**
 * funcion para crear controles para el formulario de filtrado
 *
 * @memberof ReportCommissionComponent
 */
createFormControls() {
    this.filterCommission = this.fb.group({
      IdSeller: new FormControl('', [Validators.pattern(this.CommissionRegex.integerNumber)]),
      InitialDate: new FormControl('', [Validators.pattern(null)]),
      FinalDate: new FormControl('', [Validators.pattern(null)]),
      Plu: new FormControl('', [Validators.pattern(this.CommissionRegex.integerNumber)]),
      Brand: new FormControl('', [Validators.pattern(null)]),
      SellerAudit: new FormControl('', [Validators.pattern(this.CommissionRegex.onlyLetter)]),
    });
    this.filterCommission.get('SellerAudit').valueChanges.pipe(distinctUntilChanged(), debounceTime(300)).subscribe(val => {
      if (!!val && val.length >= 2) {
        if (this.listCommission !== undefined) {
          this.listCommission2 = this.listCommission.filter(commission => commission.Name.toString().toLowerCase().includes(val.toLowerCase()));
          const exist = this.listCommission2.find(commission => commission.Name === val);
          if (!exist) {
            this.filterCommission.get('SellerAudit').setErrors({ pattern: true });
            this.invalidCommission = true;
            this.validateInput = false;
          } else {
            this.filterCommission.get('SellerAudit').setErrors(null);
            this.invalidCommission = false;
          }
        } else {
          this.filterCommission.get('SellerAudit').setValue('');
          this.validateInput = true;
          this.invalidCommission = true;
        }
      } else if (!val) {
        this.listCommission2 = [];
        this.filterCommission.get('SellerAudit').setErrors(null);
        const inputSeller = this.filterCommission.controls.IdSeller.value;
        if (!inputSeller) {
          this.validateInput = true;
        }
        this.invalidCommission = true;
      } else {
        this.filterCommission.get('SellerAudit').setErrors(null);
      }
    });

    this.clearDateEnd();
  }
/**
 * funcion para listar todos los vendedores
 *
 * @memberof ReportCommissionComponent
 */
getSellerList() {
    this.storeService.getAllStoresFull(this.user).subscribe((res: any) => {
      if (res.status === 200) {
        if (res && res.body && res.body.body) {
          const body = JSON.parse(res.body.body);
          this.listCommission = body.Data;
          if (this.listCommission.length > 0) {
            this.listCommission = this.listCommission.filter(x => x.Profile !== 'seller');
          }
        } else {
          const msg = 'Se ha presentado un error al realizar la descarga del reporte de comisiones';
          this.snackBar.open(msg, 'Cerrar', {
            duration: 3000
          });
        }
      } else {
        this.listCommission = res.message;
        this.snackBar.open(this.languageService.instant('core.http.error_handler.error_acces'), this.languageService.instant('actions.close'), {
          duration: 3000,
        });
      }
    });
  }
/**
 * funcion para listar todas las comisiones con una carga inicial de 15 atras
 *
 * @memberof ReportCommissionComponent
 */
getListCommissionAll() {
  this.loadingService.viewSpinner();
    this.reportCommissionService.getListCommissionAll(this.filter).subscribe((res: any) => {
      if (res && res.statusCode === 200) {
       const {AuditCommissionExcViewModels, Count, PaginationToken} =  JSON.parse(res.body).Data;
       this.listCommissionAll = this.mapItems(AuditCommissionExcViewModels);
       this.dataSource = new MatTableDataSource(this.listCommissionAll);
       if (this.onlyOne) {
        this.length = Count;
       }
       this.savePaginationToken(PaginationToken);
       this.loadingService.closeSpinner();
       this.showTable = true;
       this.onlyOne = false;
      }
    });
  }
/**
 * funcion para saver el pagination token
 *
 * @param {string} pagination
 * @memberof ReportCommissionComponent
 */
savePaginationToken(pagination: string) {
    const isExist = this.arrayPosition.includes(pagination);
    if (isExist === false) {
      this.arrayPosition.push(pagination);
    }
  }
/**
 *
 * funcion para mapear el resultado de la consulta del listado de comisiones
 * @param {any[]} items
 * @returns {any[]}
 * @memberof ReportCommissionComponent
 */
mapItems(items: any[]): any[] {
    return items.map(x => {
      return {
        Date:  x.Date ? moment(x.Date).format('DD/MM/YYYY') : '',
        IdVTEX: x.IdVTEX,
        Operation: x.Operation,
        SellerAudit: x.SellerAudit,
        SellerId: x.SellerId,
        SellerNameAudit: x.SellerNameAudit,
        SellerNit: x.SellerNit,
        Type: x.Type,
        Data: {
          Brand: x.Data.Brand,
          Commission: x.Data.Commission,
          Ean: x.Data.Ean,
          FinalDate: x.Data.FinalDate ? moment(x.Data.FinalDate).format('DD/MM/YYYY') : '',
          IdVTEX: x.Data.IdVTEX,
          InitialDate: x.Data.InitialDate ? moment(x.Data.InitialDate).format('DD/MM/YYYY') : ''
        }
      };
    });
  }


/**
 *
 * funcion para mostrar/ocultar el filtro
 * @memberof ReportCommissionComponent
 */
toggleFilterReportCommission() {
    this.sidenavSearchCommission.toggle();
}

/**
 *
 * funcion para mostrar el modal de la descarga del reporte de comisiciones
 * @memberof ReportCommissionComponent
 */
showModalDonloadCommission(): void {
    const dialogRef = this.dialog.open(ModalDonwloadEmailComponent, {
      data: {
        'title': 'Te enviaremos el reporte de comisiones al siguiente correo electrónico.',
        'btn': 'Enviar',
      },
    });
    const dialogIntance = dialogRef.componentInstance;
    dialogIntance.processFinish$.subscribe((val) => {
      if (val && val !== undefined) {
        this.downLoadReportCommission(val.controls.email.value);
      }
    });
  }
/**
 * funcion para consumir el endPoint para descargar el reporte
 *
 * @param {string} email
 * @memberof ReportCommissionComponent
 */
downLoadReportCommission(email: string) {
  this.loadingService.viewSpinner();
    if (email !== undefined) {
      const data = {
        email: email,
        commissionAuditFilter : {
            'IdSeller': this.filter.IdSeller,
            'Plu': this.filter.Plu,
            'Brand': this.filter.Brand,
            'InitialDate': this.filter.InitialDate ? moment(this.filter.InitialDate).format('YYYY/MM/DD') : '',
            'FinalDate': this.filter.InitialDate ? moment(this.filter.FinalDate).format('YYYY/MM/DD') : '',
            'SellerAudit': this.idAdmin
        },
      };
      this.reportCommissionService.sendReportCommission(data).subscribe((res: any) => {
        this.loadingService.closeSpinner();
        if (res && res.statusCode === 200) {
          const msg = 'Se ha realizado la descarga del reporte de comisiones correctamente, revisa tu correo electrónico en unos minutos.';
          this.snackBar.open(msg, 'Cerrar', {
            duration: 3000
          });
          this.dialog.closeAll();
        } else {
          const msg = 'Se ha presentado un error al realizar la descarga del reporte de comisiones';
          this.snackBar.open(msg, 'Cerrar', {
            duration: 3000
          });
        }
      });
    }
  }
/**
 * funcion para la paginacion del listado
 *
 * @param {*} event
 * @memberof ReportCommissionComponent
 */
paginations(event: any) {
    const newLimit = event.param.pageSize;
    const index = event.param.pageIndex;
    if (newLimit !== this.limit)  {
      this.indexPage = 0;
      this.limit = event.param.pageSize;
      this.filter.PaginationToken = '{}';
      this.filter.Limit = this.limit;
      this.filter.CurrentPage = 0;
      const paginator = this.toolbarOption.getPaginator();
      paginator.pageIndex = 0;
      this.arrayPosition = [];
      this.arrayPosition.push('{}');
    } else {
      let newPaginationToken = this.arrayPosition[index];
      if (newPaginationToken === undefined) {
          newPaginationToken = '{}';
      }
      this.filter.PaginationToken = newPaginationToken;
    }
    this.getListCommissionAll();
  }

/**
 * funcion para validar en el formuario que por lo menos tenga o el admin o el idseller
 *
 * @param {*} value
 * @memberof ReportCommissionComponent
 */
validate(value: any) {
    if (value.IdSeller.value !== '') {
      this.validateInput = false;
    } else {
      if (!this.invalidCommission) {
        this.validateInput = false;
      } else {
        this.validateInput = true;
      }
    }
  }
/**
 *
 * funcion para capturar el admin y guardar el nombre para mostrar y el id para enviar
 * @param {*} admin
 * @memberof ReportCommissionComponent
 */
getAdmin(admin: any) {
    if (admin) {
      this.idAdmin = admin.IdSeller;
      this.nameAdmin = admin.Name;
    } else {
      this.idAdmin = null;
    }
  }
/**
 * funcion para aplicar los filtros de comision al listado
 *
 * @param {*} form
 * @memberof ReportCommissionComponent
 */
apllyFilterCommission(form: any) {
    if (form !== undefined) {
      this.filter = {
        Brand : form.Brand ? form.Brand.toUpperCase() : '',
        FinalDate: form.FinalDate ? moment(form.FinalDate).format('YYYY/MM/DD') : '',
        InitialDate: form.InitialDate ? moment(form.InitialDate).format('YYYY/MM/DD') : '',
        IdSeller: form.IdSeller,
        Plu: form.Plu,
        SellerAudit: form.SellerAudit ? this.idAdmin.toString() : null,
        PaginationToken : '{}',
        Limit: this.limit,
        NewLimit: null,
        CurrentPage: 0
      };
      const nameAdmin = form.SellerAudit ? this.nameAdmin : null;
      this.onlyOne = true;
      this.filterChips = [];
      this.saveFilter({'name' : this.filter.Brand, 'type': 'Brand'});
      this.saveFilter({'name' : this.filter.FinalDate, 'type' : 'FinalDate' });
      this.saveFilter({'name' : this.filter.InitialDate, 'type': 'InitialDate' });
      this.saveFilter({'name' : this.filter.IdSeller, 'type': 'IdSeller'});
      this.saveFilter({'name' : this.filter.Plu, 'type': 'Plu'});
      this.saveFilter({'name' : nameAdmin, 'type': 'SellerAudit'});
      this.toggleFilterReportCommission();
    } else {
        const msg = 'Error al aplicar los filtros';
        this.snackBar.open(msg, 'Cerrar', {
          duration: 3000
        });
    }
    this.getListCommissionAll();
  }
/**
 * funcion para salvar los filtros en chips
 *
 * @param {*} filter
 * @memberof ReportCommissionComponent
 */
saveFilter(filter: any) {
    if (filter.name !== undefined && filter.name !== '' && filter.name !== null) {
        this.filterChips.push(filter);
    }
  }
/**
 * funcion para borrar los filtros por medio del chips
 *
 * @param {*} filter
 * @param {number} indexArray
 * @memberof ReportCommissionComponent
 */
deteleFilter(filter: any, indexArray: number) {
    if (filter) {
      switch (filter.type) {
        case 'Brand':
          this.filter.Brand = null;
          this.filterCommission.controls.Brand.reset();
          break;
        case 'FinalDate':
          this.filter.FinalDate = null;
          this.filterCommission.controls.FinalDate.reset();
          break;
        case 'InitialDate':
          this.filter.InitialDate = null;
          this.filterCommission.controls.InitialDate.reset();
          break;
        case 'IdSeller':
          if (this.filter.SellerAudit !== null) {
            this.filter.IdSeller = null;
            this.filterCommission.controls.IdSeller.reset();
          } else {
                this.keywords = [];
                this.limit = 50;
                this.idAdmin = null;
                this.filterChips = [];
                this.filterCommission.reset();
                this.filter = {
                  'IdSeller': null,
                  'Plu': null,
                  'Brand': null,
                  'InitialDate': null,
                  'FinalDate': null,
                  'SellerAudit': null,
                  'PaginationToken': '{}',
                  'Limit': this.limit,
                  'NewLimit': null,
                  'CurrentPage': 0
                };
          }
          break;
        case 'Plu':
          this.filter.Plu = null;
          this.filterCommission.controls.Plu.reset();
          break;
        case 'SellerAudit':
          if (this.filter.IdSeller !== null) {
            this.filter.SellerAudit = null;
            this.filterCommission.controls.SellerAudit.reset();
          } else {
                this.keywords = [];
                this.limit = 50;
                this.idAdmin = null;
                this.filterChips = [];
                this.filterCommission.reset();
                this.filter = {
                  'IdSeller': null,
                  'Plu': null,
                  'Brand': null,
                  'InitialDate': null,
                  'FinalDate': null,
                  'SellerAudit': null,
                  'PaginationToken': '{}',
                  'Limit': this.limit,
                  'NewLimit': null,
                  'CurrentPage': 0
                };
          }
          break;
        default:
          break;
      }
      this.filterChips.splice(indexArray, 1);
    }
    this.getListCommissionAll();
  }
/**
 *
 * funcion para limpiar el campo de fecha final cuando la fecha inicial haya cambiado
 * @param {*} changeDate
 * @memberof ReportCommissionComponent
 */
clearDateEnd() {
  this.filterCommission.get('InitialDate').valueChanges.subscribe((val) => {
   if (val) {
    this.filterCommission.controls['FinalDate'].setValue('');
    this.dateInitLimit = this.filterCommission.get('InitialDate').value;
   }
  });
  }

/**
 *
 * funcion para limpiar el formulario
 * @memberof ReportCommissionComponent
 */
clearForm() {
    this.keywords = [];
    this.limit = 50;
    this.idAdmin = null;
    this.filterChips = [];
    this.onlyOne = true;
    this.filterCommission.reset();
    this.filter = {
      'IdSeller': null,
      'Plu': null,
      'Brand': null,
      'InitialDate': null,
      'FinalDate': null,
      'SellerAudit': null,
      'PaginationToken': '{}',
      'Limit': this.limit,
      'NewLimit': null,
      'CurrentPage': 0
    };
    this.getListCommissionAll();
    this.toggleFilterReportCommission();
  }
}
