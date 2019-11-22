import { Component, OnInit, ViewChild, TemplateRef, Input } from '@angular/core';
import { MatDialog, MatTableDataSource, MatSnackBar } from '@angular/material';
import { DialogWithFormComponent } from '@app/shared/components/dialog-with-form/dialog-with-form.component';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { validateDataToEqual, trimField } from '@app/shared/util/validation-messages';
import { BehaviorSubject } from 'rxjs';
import { BasicInformationService } from '@app/secure/products/create-product-unit/basic-information/basic-information.component.service';
import { LoadingService, ModalService, Logger } from '@app/core';
import { AuthService } from '@app/secure/auth/auth.routing';
import { categoriesTreeName, readException, editException } from '@app/secure/auth/auth.consts';
import { TranslateService } from '@ngx-translate/core';
import { ExceptionBrandService } from './exception-brand.service';
import { UserInformation } from '@app/shared';
import { templateJitUrl } from '@angular/compiler';
import { ModalErrorsComponent } from '../modal-errors/modal-errors.component';

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
  // @Input() currentStoreSelect: any;

  @Input() set currentStoreSelect(value: number) {
    if (value !== undefined) {
      this.currentStoreSelect_Id = value;
      this.getExceptionBrandComision();
    }
  }

  /* Información del usuario*/
  public user: UserInformation;

  displayedColumns = ['Brand', 'Commission', 'options'];
  displayedColumnsInModal = ['Brand', 'Commission'];
  validation = new BehaviorSubject(true);
  brands = [];
  selectedBrands = [];
  selectedBrandsSources = new MatTableDataSource(this.selectedBrands);
  filterBrands = [];
  canRead = false;
  canUpdate = false;
  // preDataSource = [{ Brand: '123', Commission: 12, type: 'Marca', Id: 1 }];
  preDataSource = [];

  dataSource: MatTableDataSource<any>;

  regex;

  typeException = ['Marca'];
  // Objeto para enviar a la creacion de la excepcion de marca.
  // createData: {
  //   Type: number,
  //   SellerId: string,
  //   ExceptionValue: any
  // };

  createData: any;
  updateData: any;
  deleteData: any;

  constructor(private dialog: MatDialog,
    private fb: FormBuilder,
    private regexService: BasicInformationService,
    private loadingService: LoadingService,
    private languageService: TranslateService,
    private exceptionBrandService: ExceptionBrandService,
    private modalService: ModalService,
    private snackBar: MatSnackBar,
    private authService: AuthService) {
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
  }

  ngOnInit() {
    // this.getExceptionBrandComision();
  }

  changeType(val: any) {

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
      this.loadingService.closeSpinner();
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
      this.brands = this.brands.map(element => {
        const newElement = { Name: element.Name, IdVTEX: element.IdVTEX };
        return newElement;
      });
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
        this.regex = Data.find(element => {
          if (element.Identifier === 'formatNumber' && element.Module === 'ofertas') {
            return element;
          }
        }).Value;
        this.loadingService.closeSpinner();
        this.initForm();
      }
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
      Commission: ['', Validators.compose([trimField, Validators.max(100), Validators.min(0), Validators.pattern(this.regex)])]
    });
    this.Commission.disable();
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
        this.Commission.disable();
      } else {
        this.Brand.setErrors({ pattern: true });
      }

    });
  }

  openDialog(action: string, element?: any) {
    this.form.setValidators(null);
    const data = !!(action === 'edit') ? this.putDataForUpdate(element) : !!(action === 'create') ? this.putDataForCreate() : this.putDataForDelete();
    const dialogRef = this.dialog.open(DialogWithFormComponent, {
      data: data,
      width: '55%',
      minWidth: '280px'
    });
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
  configDialog(dialog: any, data: any, element: any) {
    if (data.action !== 'delete') {
      dialog.content = this.content;
    }
    dialog.confirmation = () => {
      const sellerId = this.currentStoreSelect_Id.toString();
      // const pruebaComi = this.form.controls.Commission.value;
      switch (data.action) {
        case 'create':
          this.createException();
          this.createData.reset();
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
          this.updateException(this.updateData);
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
  putDataForUpdate(element: any) {
    const { Id, Brand, Commission } = element;
    this.typeForm.patchValue(element);
    this.form.patchValue(element);
    const initialValue = Object.assign({ Id, Brand, Commission }, {});
    this.form.setValidators(validateDataToEqual(initialValue));
    const form = this.form;
    const title = this.languageService.instant('secure.parametize.commission.edit');
    const showButtons = true;
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

  addBrand() {
    // Capturar valores del formulario.
    const { Brand, Commission } = this.form.value;
    // Objeto nuevo que tiene Brand y Comision
    if (this.selectedBrands.length === 0) {
      this.selectedBrands.push(Object.assign({ Brand, Commission }, {}));
    } else {
      this.selectedBrands.forEach( el => {
        if (el.Brand === this.form.controls.Brand.value) {
          this.snackBar.open(this.languageService.instant('secure.offers.stores.treee.components.exception_brand_exist'), this.languageService.instant('actions.close'), {
            duration: 5000,
          });
        } else {
          this.selectedBrands.push(Object.assign({ Brand, Commission }, {}));
        }
      });
    }
    this.selectedBrandsSources.data = this.selectedBrands;
    this.form.reset();
    this.validation.next(false);
  }

  deleteElement(element: any) {
    this.openDialog('delete', element);
  }

  /**
   * Metodo para eliminar elementos de comisiones
   * @param {*} element
   * @memberof ExceptionBrandComponent
   */
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
      element.IdVTEX = vtexId;
      this.preDataSource.push(element);
    });
    this.createData = {
      'Type': 1,
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
      } catch {
        this.modalService.showModal('errorService');
      }
      this.loadingService.closeSpinner();
    });
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
}
