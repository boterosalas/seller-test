import { Component, OnInit, ViewChild, TemplateRef, Input } from '@angular/core';
import { MatDialog, MatTableDataSource, MatSnackBar } from '@angular/material';
import { DialogWithFormComponent } from '@app/shared/components/dialog-with-form/dialog-with-form.component';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { validateDataToEqual, trimField } from '@app/shared/util/validation-messages';
import { BehaviorSubject, Subscription } from 'rxjs';
import { BasicInformationService } from '@app/secure/products/create-product-unit/basic-information/basic-information.component.service';
import { LoadingService, ModalService, Logger } from '@app/core';
import { AuthService } from '@app/secure/auth/auth.routing';
import { categoriesTreeName, readException, editException } from '@app/secure/auth/auth.consts';
import { TranslateService } from '@ngx-translate/core';
import { ExceptionBrandService } from './exception-brand.service';
import { UserInformation } from '@app/shared';
import { templateJitUrl } from '@angular/compiler';
import { ModalErrorsComponent } from '../modal-errors/modal-errors.component';
import { element } from '@angular/core/src/render3/instructions';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { DatePipe } from '@angular/common';

const log = new Logger('ExceptionBrandComponent');

@Component({
  selector: 'app-exception-brand',
  templateUrl: './exception-brand.component.html',
  styleUrls: ['./exception-brand.component.scss']
})
export class ExceptionBrandComponent implements OnInit {

  form: FormGroup;
  typeForm: FormGroup;
  @ViewChild('dialogContent') content: TemplateRef<any>;
  currentStoreSelect_Id: any;
  vtexIdUpdate: any;
  body: any;
  IdVtex: any;
  addException: boolean;
  typeValue: any;
  // @Input() currentStoreSelect: any;

  @Input() set currentStoreSelect(value: number) {
    if (value !== undefined) {
      this.currentStoreSelect_Id = value;
      this.getExceptionBrandComision();
    }
  }

  /* Información del usuario*/
  public user: UserInformation;

  displayedColumns = ['Type', 'Description', 'InitialDate', 'FinalDate', 'Commission', 'options'];
  displayedColumnsInModal = ['Brand', 'InitialDate', 'FinalDate', 'Commission'];
  validation = new BehaviorSubject(true);
  brands = [];
  selectedBrands = [];
  selectedBrandsSources = new MatTableDataSource(this.selectedBrands);
  filterBrands = [];
  canRead = false;
  canUpdate = false;
  actionsEdit = false;
  preDataSource = [];

  dataSource: MatTableDataSource<any>;

  regex;

  typeException = [
    { name: 'MARCA', value: 'MARCA' },
    { name: 'PLU', value: 'PLU' }
  ];

  createData: any;
  updateData: any;
  deleteData: any;

  disableInputType: Boolean = false;

  currentScreenWidth: String = '';
  flexMediaWatcher: Subscription;

  public locale = 'es-CO';

  constructor(private dialog: MatDialog,
    private fb: FormBuilder,
    private regexService: BasicInformationService,
    private loadingService: LoadingService,
    private languageService: TranslateService,
    private exceptionBrandService: ExceptionBrandService,
    private modalService: ModalService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private media: ObservableMedia) {
    this.typeForm = this.fb.group({
      type: ['']
    });
    this.getRegex();
    this.getBrands();
    this.dataSource = new MatTableDataSource(this.preDataSource);
    this.typeForm.get('type').valueChanges.subscribe((val) => {
      this.changeType(val);
    });
    this.getPermissions();
    this.validatePermissions();
    // Metodo para validar el tamaño de la pantalla y ocultar o no columnas.
    this.flexMediaWatcher = media.subscribe((change: MediaChange) => {
      if (change.mqAlias !== this.currentScreenWidth) {
        this.currentScreenWidth = change.mqAlias;
        this.setupTableColummns();
      }
    });
  }

  ngOnInit() {
    // this.getExceptionBrandComision();
  }

  changeType(val: any) {

  }

  /**
   * Metodo para validar que la fecha inicial no sea menor a la fecha actual.
   * @memberof ExceptionBrandComponent
   */
  minorDate() {
    const datePipe = new DatePipe(this.locale);

    const dateInitial = datePipe.transform(this.InitialDate.value, 'dd/MM/yyyy');

    if (dateInitial && (dateInitial < this.getDate2())) {
      this.InitialDate.setErrors({ minorDate: true });
    } else {
      this.InitialDate.setErrors(null);
    }
  }

  /**
   * Metodo para comparar fechas y mostrar error que la fecha final no sea mayor a la inicial
   * @memberof ExceptionBrandComponent
   */
  public compareDate() {
    const datePipe = new DatePipe(this.locale);

    const dateInitial = datePipe.transform(this.InitialDate.value, 'dd/MM/yyyy');
    const dateFinal = datePipe.transform(this.FinalDate.value, 'dd/MM/yyyy');

    if (dateInitial && (dateInitial > dateFinal)) {
      this.FinalDate.setErrors({ minorDate2: true });
    } else {
      this.FinalDate.setErrors(null);
    }
  }

  private getDate2(): any {
    let today: any = new Date();
    let dd: any = today.getDate();
    let mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();

    if (dd < 10) {
      dd = '0' + dd;
    }

    if (mm < 10) {
      mm = '0' + mm;
    }

    today = dd + '-' + mm + '-' + yyyy;
    return today;
  }

  /**
   * Metodo para cambiar las columnas dependiendo el tamaño de la pantalla
   * @memberof ExceptionBrandComponent
   */
  setupTableColummns() {
    if (this.currentScreenWidth === 'xs') {
      this.displayedColumns = ['Type', 'Description', 'Commission', 'options'];
      this.displayedColumnsInModal = ['Brand', 'Commission'];

    } else {
      this.displayedColumns = ['Type', 'Description', 'InitialDate', 'FinalDate', 'Commission', 'options'];
      this.displayedColumnsInModal = ['Brand', 'InitialDate', 'FinalDate', 'Commission'];


    }
  }

  resetForms() {
    this.form.reset();
    this.typeForm.reset();
    this.typeValue = null;
  }

  /**
   * Cerrar dialogo de editar
   * @memberof ExceptionBrandComponent
   */
  close() {
    this.dialog.closeAll();
    this.form.reset();
    this.resetForms();
  }

  /**
   * Metodo para darle permisos
   * @memberof ExceptionBrandComponent
   */
  getPermissions() {
    this.canRead = this.authService.getPermissionForMenu(categoriesTreeName, readException);
    this.canUpdate = this.authService.getPermissionForMenu(categoriesTreeName, editException);
  }

  /**
   * Metodo para validar los permisos
   * @memberof ExceptionBrandComponent
   */
  validatePermissions() {
    if (!this.canUpdate) {
      const index = this.displayedColumns.findIndex(x => x === 'options');
      if (index >= 0) {
        this.displayedColumns.splice(index, 1);
      }
    }
  }

  /**
   * Llamar servicio de marcas y traer todas las marcas.
   * @memberof ExceptionBrandComponent
   */
  getBrands() {
    this.loadingService.viewSpinner();
    this.regexService.getActiveBrands().subscribe(brands => {
      const initialBrands = brands.Data.Brands;
      this.brands = initialBrands.sort((a, b) => {
        if (a.Name > b.Name) {
          return 1;
        }
        if (a.Name < b.Name) {
          return -1;
        }
        return 0;
      });
      // tslint:disable-next-line: no-shadowed-variable
      this.brands = this.brands.map(element => {
        const newElement = { Name: element.Name, IdVTEX: element.IdVTEX };
        return newElement;
      });
      this.loadingService.closeSpinner();
    });
  }

  /**
   * Metodo que obtiene las regex de la BD y se utiliza para valdiar el formulario.
   * @memberof ExceptionBrandComponent
   */
  getRegex() {
    this.loadingService.viewSpinner();
    this.regexService.getRegexInformationBasic(null).subscribe(res => {
      const { Data } = !!res && !!res.body && !!res.body.body && JSON.parse(res.body.body);
      if (!!Data && Data.length) {
        // tslint:disable-next-line: no-shadowed-variable
        this.regex = Data.find(element => {
          if (element.Identifier === 'formatNumber' && element.Module === 'ofertas') {
            return element;
          }
        }).Value;
        this.initForm();
      }
      this.loadingService.closeSpinner();
    });
  }

  /**
   * Se inicializa el formulario con sus respectivas validaciones.
   * @memberof ExceptionBrandComponent
   */
  initForm() {
    this.form = this.fb.group({
      Id: [''],
      Brand: ['', Validators.compose([trimField, Validators.minLength(2)])],
      Commission: ['', Validators.compose([trimField, Validators.max(100), Validators.min(0), Validators.pattern(this.regex)])],
      InitialDate: [''],
      FinalDate: [''],
      Plu: ['', Validators.pattern(this.regex)]
    });
    // this.Commission.disable();
    this.Brand.valueChanges.pipe(distinctUntilChanged(), debounceTime(300)).subscribe(val => {
      if (!!val && val.length >= 2) {
        this.filterBrands = this.brands.filter(brand => brand.Name.toString().toLowerCase().includes(val.toLowerCase()));
        const exist = this.filterBrands.find(brand => brand.Name === val);
        if (!exist) {
          this.Brand.setErrors({ pattern: true });
        } else {
          this.Brand.setErrors(null);
          this.Commission.enable();
        }
      } else if (!val) {
        this.filterBrands = [];
        this.Brand.setErrors({ required: true });
        // this.Commission.disable();
      } else {
        this.Brand.setErrors({ pattern: true });
      }

    });
  }

  /**
   * Metodo que abre el modal para crear, eliminar o editar.
   * @param {string} action
   * @param {*} [element]
   * @memberof ExceptionBrandComponent
   */
  // tslint:disable-next-line: no-shadowed-variable
  openDialog(action: string, element?: any) {
    if (action && (action === 'create')) {
      this.disableInputType = false;
      this.form.controls.Brand.enable();
      this.typeForm.controls.type.enable();
      this.form.controls.Plu.enable();
    }

    if (action && (action === 'edit')) {
      this.form.controls.Brand.disable();
      this.typeForm.controls.type.disable();
      this.form.controls.Plu.disable();
    }
    this.form.setValidators(null);
    if (element && element.InitialDate) {
      element.InitialDate = element.InitialDate.replace(' ', 'T');
    }
    if (element && element.FinalDate) {
      element.FinalDate = element.FinalDate.replace(' ', 'T');
    }
    const data = !!(action === 'edit') ? this.putDataForUpdate(element) : !!(action === 'create') ? this.putDataForCreate() : this.putDataForDelete();
    const dialogRef = this.dialog.open(DialogWithFormComponent, {
      data: data,
      width: '55%',
      minWidth: '280px'
    });
    if (action === 'edit') {
      this.actionsEdit = true;
    }
    const dataToConfig = !!element ? { action, element } : { action };
    this.configDialog(dialogRef.componentInstance, dataToConfig, element);
    dialogRef.afterClosed().subscribe(() => {
      this.selectedBrands = [];
      this.validation.next(true);
      this.typeForm.reset();
      // colocar funcion q obtiene todas las excepciones por marca
    });
  }

  /**
   * Metodo para pasarle la configuracion al dialogo, si es EDITAR, Crear o Eliminar
   * @param {*} dialog
   * @param {*} data
   * @param {*} element
   * @memberof ExceptionBrandComponent
   */
  // tslint:disable-next-line: no-shadowed-variable
  configDialog(dialog: any, data: any, element: any) {
    if (element && element.IdVTEX) {
      this.IdVtex = element.IdVTEX;
    }
    if (data.action !== 'delete') {
      dialog.content = this.content;
    }
    dialog.confirmation = () => {
      const sellerId = this.currentStoreSelect_Id.toString();
      // const pruebaComi = this.form.controls.Commission.value;
      switch (data.action) {
        case 'create':
          this.createException();
          break;
        case 'edit':
          this.updateData = {
            'IdSeller': sellerId,
            'ExceptionValues': [{
              'Id': element.Id,
              'Commission': this.form.controls.Commission.value,
              'IdVTEX': element.IdVTEX
            }]
          };
          // this.updateException(this.updateData);
          this.form.reset();
          break;
        case 'delete':
          this.deleteData = `${sellerId}/${element.Id}`;
          this.deletException(this.deleteData);
          break;
      }
    };
  }

  /**
   * Metodo que obtiene la data para eliminar una excepcion por marca
   * @returns
   * @memberof ExceptionBrandComponent
   */
  putDataForDelete() {
    const form = null;
    const title = this.languageService.instant('secure.parametize.commission.delete');
    const message = this.languageService.instant('secure.parametize.commission.message');
    const messageCenter = true;
    const showButtons = true;
    const icon = null;
    const btnConfirmationText = null;
    return { form, title, message, messageCenter, showButtons, icon, btnConfirmationText };
  }

  /**
   *  Metodo que obtiene la data para editar una excepcion por marca
   * @param {*} element
   * @returns
   * @memberof ExceptionBrandComponent
   */
  // tslint:disable-next-line: no-shadowed-variable
  putDataForUpdate(element: any) {
    console.log(2, element);
    const { Id, Brand, Commission, InitialDate, FinalDate } = element;
    this.typeForm.patchValue(element);
    this.form.patchValue(element);
    this.typeValue = element.TypeName;
    const initialValue = Object.assign({ Id, Brand, Commission, InitialDate, FinalDate }, {});
    this.form.setValidators(validateDataToEqual(initialValue));
    console.log(this.form);
    if (element && element.TypeId === 2) {
      this.form.controls['Plu'].setValue(element.IdVTEX);
    }
    this.disableInputType = true;
    const form = this.form;
    const title = this.languageService.instant('secure.parametize.commission.edit');
    const showButtons = false;
    const icon = null;
    const btnConfirmationText = 'Editar';
    return { form, title, showButtons, icon, btnConfirmationText };
  }

  /**
   *  Metodo que obtiene la data para crear una excepcion por marca
   * @returns
   * @memberof ExceptionBrandComponent
   */
  putDataForCreate() {
    const form = this.form;
    const title = this.languageService.instant('secure.parametize.commission.addTariffs');
    const message = null;
    const messageCenter = false;
    const showButtons = true;
    const icon = null;
    const btnConfirmationText = null;
    const validation = this.validation;
    return { form, title, message, messageCenter, showButtons, icon, btnConfirmationText, validation };
  }

  /**
   * Funcion que se encarga de ir añadiendo las marcas que se van agregando por excepcion
   * @memberof ExceptionBrandComponent
   */
  addBrand() {
    let dateInitial;
    let dateFinal;

    // Capturar valores del formulario.
    const { Brand, Plu, Commission, InitialDate, FinalDate } = this.form.value;
    // Objeto nuevo que tiene Brand y Comision
    if (this.selectedBrands.length === 0) {
      this.selectedBrands.push(Object.assign({ Brand, Plu, Commission, InitialDate, FinalDate }, {}));
    } else {
      this.selectedBrands.forEach(el => {
        if (el.Brand === this.form.controls.Brand.value) {
          this.addException = true;
          this.snackBar.open(this.languageService.instant('secure.offers.stores.treee.components.exception_brand_exist'), this.languageService.instant('actions.close'), {
            duration: 5000,
          });
        } else {
          this.addException = false;
        }
      });
      if (this.addException !== true) {
        this.selectedBrands.push(Object.assign({ Brand, Commission, InitialDate, FinalDate }, {}));
      }
    }
    this.selectedBrandsSources.data = this.selectedBrands;
    this.form.reset();
    this.validation.next(false);
    this.selectedBrands.forEach(el2 => {
      if (el2.InitialDate) {
        // let dateInitial;
        dateInitial = el2.InitialDate.replace('T', ' ');
        el2.InitialDate = dateInitial;
      }
      if (el2.FinalDate) {
        // let dateFinal;
        dateFinal = el2.FinalDate.replace('T', ' ');
        el2.FinalDate = dateFinal;
      }
    });
  }

  /**
   * Metodo para eliminar una marca del listado
   * @param {*} element
   * @memberof ExceptionBrandComponent
   */
  // tslint:disable-next-line: no-shadowed-variable
  deleteElement(element: any) {
    this.openDialog('delete', element);
  }

  /**
   * Metodo para eliminar elementos de comisiones
   * @param {*} element
   * @memberof ExceptionBrandComponent
   */
  // tslint:disable-next-line: no-shadowed-variable
  removeElement(element: any) {
    const index = this.preDataSource.findIndex(value => value === element);
    // tslint:disable-next-line:no-unused-expression
    (index >= 0) && this.preDataSource.splice(index, 1);
    this.dataSource.data = this.preDataSource;
  }

  /**
   * Metodo para obtener todas las excepciones de comisiones
   * @memberof ExceptionBrandComponent
   */
  public getExceptionBrandComision() {
    this.loadingService.viewSpinner();
    this.exceptionBrandService.getExceptionBrand(this.currentStoreSelect_Id).subscribe(res => {
      if (res['status'] === 200 || res['status'] === 201) {
        const data = res['body']['body'];
        const dataComision = JSON.parse(data);
        if (dataComision.Data.length > 0) {
          const dataSourceException = dataComision.Data[0].ExceptionValues;
          this.dataSource = new MatTableDataSource(dataSourceException);
          this.loadingService.closeSpinner();
        } else {
          // this.modalService.showModal('errorService');
        }
      } else {
        this.modalService.showModal('errorService');
      }
      this.loadingService.closeSpinner();
    });
  }

  /**
   * Metodo para crear la excepcion de comision por marca.
   * @memberof ExceptionBrandComponent
   */
  public createException() {
    this.loadingService.viewSpinner();
    let vtexId = '';
    const sellerId = this.currentStoreSelect_Id.toString();
    this.selectedBrands.forEach(element => {
      this.brands.forEach(el => {
        if (el.Name === element.Brand) {
          vtexId = el.IdVTEX;
        }
      });
      console.log('ele: ', element, element.Name);
      if (!element.Name) {
        vtexId = element.Plu;
      }
      element.IdVTEX = vtexId;
      this.preDataSource.push(element);
    });
    console.log();
    this.createData = {
      'Type': this.typeValue === 'MARCA' ? 1 : 2,
      'IdSeller': sellerId,
      'ExceptionValues': this.preDataSource
    };
    this.exceptionBrandService.createExceptionBrand(this.createData).subscribe(res => {
      const resCreate = JSON.parse(res['body'].body);
      // const resDialog = res;
      try {
        if (res && res['status'] === 200) {
          if (resCreate.Data === true) {
            this.getExceptionBrandComision();
            this.openDialogSendOrder(res);
            this.preDataSource = [];
          } else {
            this.openDialogSendOrder(res);
          }
        }
      } catch {
        this.modalService.showModal('errorService');
      }
      this.loadingService.closeSpinner();
      this.preDataSource = [];
      this.resetForms();
    });
  }

  /**
   * Metodo para editar la excepcion de marca consumiendo el servicio
   * @param {*} dataUpdate
   * @memberof ExceptionBrandComponent
   */
  public updateException(dataUpdate: any) {
    this.loadingService.viewSpinner();
    this.exceptionBrandService.updateExceptionBrand(dataUpdate).subscribe(res => {
      const resUpdate = JSON.parse(res['body'].body);
      try {
        if (res && res['status'] === 200) {
          if (resUpdate.Data === true) {
            this.snackBar.open(this.languageService.instant('secure.offers.stores.treee.components.exception_brand_update_ok'), this.languageService.instant('actions.close'), {
              duration: 5000,
            });
            this.getExceptionBrandComision();
          } else {
            this.snackBar.open(this.languageService.instant('secure.offers.stores.treee.components.exception_brand_update_ko'), this.languageService.instant('actions.close'), {
              duration: 5000,
            });
          }
        }
        this.actionsEdit = false;
        this.close();
      } catch {
        this.modalService.showModal('errorService');
        this.close();
      }
      this.loadingService.closeSpinner();
    });
  }


  /**
   * Funcion que llama al servicio de editar y se pasa los parametros requeridos
   * @memberof ExceptionBrandComponent
   */
  confirmationEdit() {
    const sellerId = this.currentStoreSelect_Id.toString();
    this.body = this.form.value;
    this.updateData = {
      'IdSeller': sellerId,
      'Type': this.typeValue === 'MARCA' ? 1 : 2,
      'ExceptionValues': [{
        'Id': this.body.Id,
        'Commission': this.body.Commission,
        'IdVtex': this.IdVtex,
        'InitialDate': this.body.InitialDate === this.body.InitialDate ? this.body.InitialDate.replace('T', ' ') : null,
        'FinalDate': this.body.FinalDate === this.body.FinalDate ? this.body.FinalDate.replace('T', ' ') : null,
      }]
    };
    this.updateException(this.updateData);
    this.form.controls.Brand.enable();

  }

  /**
   * Metodo para crear la excepcion de marca consumiendo el servicio
   * @param {*} dataDelete
   * @memberof ExceptionBrandComponent
   */
  public deletException(dataDelete: any) {
    this.loadingService.viewSpinner();
    this.exceptionBrandService.deleteExceptionBrand(dataDelete).subscribe(res => {
      const resDelete = JSON.parse(res['body']);
      try {
        if (res && res['statusCode'] === 200) {
          if (resDelete.Data === true) {
            this.snackBar.open(this.languageService.instant('secure.offers.stores.treee.components.exception_brand_delete_ok'), this.languageService.instant('actions.close'), {
              duration: 5000,
            });
            // this.openDialogSendOrder(res);
            this.getExceptionBrandComision();
          } else {
            this.snackBar.open(this.languageService.instant('secure.offers.stores.treee.components.exception_brand_delete_ko'), this.languageService.instant('actions.close'), {
              duration: 5000,
            });
          }
        }
      } catch {
        this.modalService.showModal('errorService');
      }
      this.loadingService.closeSpinner();
    });
  }

  /**
   * Metodo para abrir el modal de errores o exito
   * @param {*} res
   * @memberof ExceptionBrandComponent
   */
  openDialogSendOrder(res: any): void {
    const dialogRef = this.dialog.open(ModalErrorsComponent, {
      width: '95%',
      // disableClose: res.body.data.status === 1,
      data: {
        response: res
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      log.info('The dialog was closed');
    });
  }

  get Brand(): FormControl {
    return this.form.get('Brand') as FormControl;
  }

  get Commission(): FormControl {
    return this.form.get('Commission') as FormControl;
  }

  get InitialDate(): FormControl {
    return this.form.get('InitialDate') as FormControl;
  }

  get FinalDate(): FormControl {
    return this.form.get('FinalDate') as FormControl;
  }

  get Plu(): FormControl {
    return this.form.get('Plu') as FormControl;
  }

  get Type(): FormControl {
    return this.form.get('type') as FormControl;
  }

}
