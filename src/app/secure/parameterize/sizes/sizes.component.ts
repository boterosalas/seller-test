import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher, MatDialog, MatDialogRef, MatSnackBar, MatTableDataSource, PageEvent } from '@angular/material';
import { LoadingService, Logger, ModalService } from '@app/core';
import { FinishUploadProductInformationComponent } from '@app/secure/products/bulk-load-product/finish-upload-product-information/finish-upload-product-information.component';
import { BasicInformationService } from '@app/secure/products/create-product-unit/basic-information/basic-information.component.service';
import { SupportService } from '@app/secure/support-modal/support.service';
import { DialogInfoComponent } from '@app/shared/components/dialog-info/dialog-info.component';
import { DialogWithFormComponent } from '@app/shared/components/dialog-with-form/dialog-with-form.component';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ModalBulkloadBrandsComponent } from '../brands/modal-bulkload-brands/modal-bulkload-brands.component';
import { SizesService } from './sizes.service';

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

const log = new Logger('SizesComponent');

@Component({
  selector: 'app-sizes',
  templateUrl: './sizes.component.html',
  styleUrls: ['./sizes.component.scss']
})
export class SizesComponent implements OnInit {

  @ViewChild('dialogContent', { static: false }) content: TemplateRef<any>;
  @ViewChild('matSlideToggle', { static: false }) matSlideToggle: ElementRef;
  @ViewChild('buttonClose', { static: false }) buttonClose: ElementRef;

  displayedColumns = ['Name', 'State', 'Actions'];

  // dataSource: any;


  public paginationToken = '{}';
  public limit = 0;
  titleAgreement: any;
  length = 0;
  public pageSize = 50;

  public arrayPosition = [];
  paramsArray: any;
  pageSizeOptions: number[] = [50, 100, 200];
  pageEvent: PageEvent;
  public callOne = true;
  sizes: any;

  dataSource: MatTableDataSource<any>;

  public filterSizes: FormGroup;
  public form: FormGroup;

  sizeRegex = {
    sizeProduct: ''
  };

  keySize = [];
  validateKeySize = true;
  removable = true;


  // parametro de filtro
  namefilter: string;

  subs: Subscription[] = [];
  changeNameSize: any;

  validateExit = true;

  checkIfDoneCharge: any = null;
  /* Mirar el estado del progreso de la carga*/
  public progressStatus = false;

  dataDialog: any;
  dataIfError: any;


  constructor(
    private service: SizesService,
    private loadingService: LoadingService,
    private modalService: ModalService,
    private languageService: TranslateService,
    private fb?: FormBuilder,
    public SUPPORT?: SupportService,
    public snackBar?: MatSnackBar,
    public dialog?: MatDialog,
  ) { }

  ngOnInit() {
    this.setIntervalStatusSize();
    this.listSize();
    this.validateFormSupport();
  }

  /**
   * Metodo para cerrar dialogo
   * @memberof SizesComponent
   */
  onNoClick() {
    this.dialog.closeAll();
  }

  /**
   * Metodo para obtener regex de dynamo
   * @memberof SizesComponent
   */
  public validateFormSupport(): void {
    this.SUPPORT.getRegexFormSupport(null).subscribe(res => {
      let dataRegexs = JSON.parse(res.body.body);
      dataRegexs = dataRegexs.Data.filter(data => data.Module === 'productos');
      for (const val in this.sizeRegex) {
        if (!!val) {
          const element = dataRegexs.find(regex => regex.Identifier === val.toString());
          this.sizeRegex[val] = element && `${element.Value}`;
        }
      }
      this.createFormControls();
    });
  }

  /**
   * Filtro por nombre de tallas
   * @memberof SizesComponent
   */
  createFormControls() {
    this.filterSizes = this.fb.group({
      SizeName: new FormControl('', [Validators.pattern(this.sizeRegex.sizeProduct)]),
    });

    this.form = new FormGroup({
      nameSize: new FormControl('', [Validators.pattern(this.sizeRegex.sizeProduct)])
    });

    this.form.valueChanges.subscribe(() => {
      this.validateExit = false;
    });
  }

  /**
   * Función para ir guardando las tallas como chips.
   * @memberof SizesComponent
   */
  public saveSomeSizes(): void {
    let word = this.form.controls.nameSize.value;
    if (word) {
      word = word.trim();
      word = word.replace(/ /g, '');
      if (word.search(',') === -1) {
        this.keySize.push(word);
      } else {
        const counter = word.split(',');
        counter.forEach(element => {
          if (element) {
            this.keySize.push(element);
          }
        });
      }
      this.form.controls.nameSize.clearValidators();
      this.form.controls.nameSize.reset();
      this.validateKeySize = this.keySize.length > 0 ? false : true;
    }
  }

  /**
   * Funcion para ir eliminando tallas
   * @param {number} indexOfValue
   * @memberof SizesComponent
   */
  public deleteKeySize(indexOfValue: number): void {
    this.keySize.splice(indexOfValue, 1);
    this.validateKeySize = this.keySize.length > 0 ? false : true;
  }



  confirmation() {
    // this.loadingService.viewSpinner();
    if (this.changeNameSize) {
      console.log('edit');
      console.log(this.form)

      const dataToSendSize = {
        'NewSize': this.form.controls.nameSize.value,
        'OldSize': this.changeNameSize,
        'Status': 1
      };

      this.service.updateSizes(dataToSendSize).subscribe(result => {
        console.log(result);
        // const errorMessage = JSON.parse(result.body);

        // if (result.statusCode === 200 || result.statusCode === 201) {
        //     this.snackBar.open('Actualizó correctamente la marca.', 'Cerrar', {
        //         duration: 5000,
        //     });
        //     this.dialog.closeAll();
        //     this.loadingService.closeSpinner();
        //     this.listSize();
        // } else {
        //     this.snackBar.open(errorMessage[0].Message, 'Cerrar', {
        //         duration: 5000,
        //     });
        //     this.dialog.closeAll();
        //     this.loadingService.closeSpinner();
        // }
      });
    } else {
      console.log('create');
      this.service.createSizes(this.keySize).subscribe(result => {
        console.log(result);
        if (result['data'] === true) {
          console.log('valida status');
          this.setIntervalStatusSize();
        }

        // const errorMessage = JSON.parse(result);

        // if (result.statusCode === 200 || result.statusCode === 201) {
        //     this.listSize();
        //     this.snackBar.open('Agregó correctamente una marca.', 'Cerrar', {
        //         duration: 5000,
        //     });
        //     this.dialog.closeAll();
        //     this.loadingService.closeSpinner();
        // } else {
        //     this.snackBar.open(errorMessage[0].Message, 'Cerrar', {
        //         duration: 5000,
        //     });
        //     this.dialog.closeAll();
        //     this.loadingService.closeSpinner();
        // }
      });
    }
  }


  /**
   * Funcion para listar tallas.
   * @param {*} [params]
   * @param {*} [filters]
   * @memberof SizesComponent
   */
  listSize(params?: any, filters?: any) {
    this.loadingService.viewSpinner();
    let urlParams;
    if (params) {
      urlParams = params;
      console.log('if')
    } else {
      console.log('else')
      urlParams = `?limit=${this.pageSize}&paginationToken=${encodeURI(this.paginationToken)}`;
    }
    if (filters) {
      urlParams = `?name=${filters}&limit=${this.limit}&paginationToken=` + this.paginationToken;
    }
    console.log(urlParams);
    this.service.getListSizes(urlParams).subscribe(result => {
      console.log(result);
      if (result) {
        this.dataSource = result.viewModel;
        console.log(this.dataSource);
        if (this.callOne) {
          console.log('this.callOne: ', this.callOne)
          this.length = result.count;
          this.arrayPosition = [];
          this.arrayPosition.push('{}');
          this.callOne = false;
        }
        this.paginationToken = result.paginationToken;
        this.loadingService.closeSpinner();
      }
    }, error => {
      this.loadingService.closeSpinner();
      this.modalService.showModal('errorService');
    });
  }

  /**
   * Evento para manejar la paginación
   * @param {*} event
   * @returns {*}
   * @memberof SizesComponent
   */
  paginations(event: any): any {
    console.log(event);
    if (event.pageSize !== this.limit) {
      this.limit = event.pageSize;
    }
    if (event && event.pageIndex >= 0) {
      console.log('entra aki');
      const index = event.pageIndex;
      if (index === 0) {
        this.paginationToken = encodeURI('{}');
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
        this.paginationToken = encodeURI('{}');
      }
      this.paramsArray = '?limit=' + this.limit + '&paginationToken=' + encodeURI(this.paginationToken);
      this.listSize(this.paramsArray);
    }
  }

  /**
   * Funcion para aplicar filtros y permanecer paginacion y limite
   * @memberof SizesComponent
   */
  public filterApply() {
    this.callOne = true;
    this.paginationToken = encodeURI('{}');
    this.namefilter = encodeURIComponent(this.filterSizes.controls.SizeName.value);
    this.listSize(null, this.namefilter.toUpperCase());
  }

  /**
   * Limpiar filtros
   * @memberof SizesComponent
   */
  public cleanFilter() {
    this.filterSizes.reset();
    this.listSize();
  }

  /**
   * Servicio para cambiar el estado de una talla.
   * @param {*} element
   * @memberof SizesComponent
   */
  public changeStatusSize(element: any) {
    console.log(element);
    this.paginationToken = '{}';
    const paramChange = { 'OldSize': element };
    this.loadingService.viewSpinner();
    console.log(paramChange);
    this.callOne = true;
    this.service.changeStatus(paramChange).subscribe(result => {
      console.log(result);
      if (result && result.status === 200) {
        if (result.body.data === true) {
          console.log(result.data);
          this.listSize();
          this.snackBar.open('Has cambiado correctamente el estado de la talla ' + element + '.', this.languageService.instant('actions.close'), {
            duration: 5000,
          });
          this.loadingService.closeSpinner();
        } else {
          this.loadingService.closeSpinner();
          this.snackBar.open('Se ha producido un error al tratar de cambiar el estado de la talla ' + element, this.languageService.instant('actions.close'), {
            duration: 5000,
          });
        }
      }
    }, error => {
      this.loadingService.closeSpinner();
      this.modalService.showModal('errorService');
    });
  }

  /**
   * Metodo para eliminar tallas
   * @param {*} element
   * @memberof SizesComponent
   */
  public deleteSize(element: any) {
    console.log(element);
    this.paginationToken = '{}';
    const paramDelete = '?name=' + element;
    this.loadingService.viewSpinner();
    console.log(paramDelete);
    this.callOne = true;
    this.service.deleteSize(paramDelete).subscribe(result => {
      console.log(result);
      if (result && result.data === true) {
        console.log(result.data);
        // this.loadingService.closeSpinner();
        this.snackBar.open('Has eliminado correctamente la talla ' + element + '.', this.languageService.instant('actions.close'), {
          duration: 5000,
        });
        this.listSize();
      } else {
        this.loadingService.closeSpinner();
        this.snackBar.open('Se ha producido un error al tratar de eliminar la talla ' + element, this.languageService.instant('actions.close'), {
          duration: 5000,
        });
      }
    }, error => {
      this.loadingService.closeSpinner();
      this.modalService.showModal('errorService');
    });
  }

  /**
   * Metodo para parametrizar, si es crear o editar tallas
   * @param {*} sizesData
   * @memberof SizesComponent
   */
  public parametrizeSizes(sizesData: any): void {
    console.log(sizesData);
    const dataDialog = this.setDataChangeStatusDialog(sizesData);
    this.form.controls['nameSize'].setErrors({ 'validExist': true });
    if (!!dataDialog && !!dataDialog.title) {
      const dialogRef = this.dialog.open(DialogWithFormComponent, {
        width: '55%',
        minWidth: '280px',
        data: dataDialog
      });
      setTimeout(() => {
        this.configDataDialog(dialogRef);
      });
    }
  }

  /**
   * Metodo para configurar datos dekl dialogo
   * @param {MatDialogRef<DialogWithFormComponent>} dialog
   * @memberof SizesComponent
   */
  configDataDialog(dialog: MatDialogRef<DialogWithFormComponent>) {
    const dialogInstance = dialog.componentInstance;
    dialogInstance.content = this.content;
    this.subs.push(dialog.afterClosed().subscribe(() => {
      this.form.reset({ nameBrands: '', IdBrands: '' });
    }));
  }

  /**
   * Setear data abrir moda crear o editar talla
   * @param {*} sizeData
   * @returns
   * @memberof SizesComponent
   */
  setDataChangeStatusDialog(sizeData: any) {
    console.log(sizeData);
    let message = '';
    let title = '';
    let icon = '';
    let form = null;
    let messageCenter = false;
    const showButtons = false;
    const btnConfirmationText = null;

    if (sizeData) {
      message = 'Para crear una talla nuevac debes ingresar el valor de la talla como quieras que aparezca en el sitio. Ten en cuenta que si la talla ya existe no podrás crearla. No podrás utilizar ningún simpolo o caracter especial.';
      icon = 'edit';
      title = 'Editar Talla';
      messageCenter = false;
      this.changeNameSize = sizeData;
      this.form.controls['nameSize'].setValue(sizeData);
      // this.form.controls['idBrands'].setValue(sizeData.Id);
      // this.form.controls['status'].setValue(sizeData.Status);
    } else {
      message = 'Para crear una talla nuevac debes ingresar el valor de la talla como quieras que aparezca en el sitio. Ten en cuenta que si la talla ya existe no podrás crearla. No podrás utilizar ningún simpolo o caracter especial.';
      icon = 'add';
      title = 'Agrear talla';
      messageCenter = false;
    }
    form = this.form;
    return { title, message, icon, form, messageCenter, showButtons, btnConfirmationText };
  }

  /**
   * Metodo consultar status de carga cada 7 segs
   * @memberof SizesComponent
   */
  setIntervalStatusSize() {
    clearInterval(this.checkIfDoneCharge);
    this.checkIfDoneCharge = setInterval(() => this.service.statusSize().subscribe((res) => {
      console.log(66, res);
      this.verifyStateCharge(res);
    }), 7000);
  }

  /**
   * Funcion apra cerrar modal
   * @memberof SizesComponent
   */
  public closeActualDialog(): void {
    if (this.progressStatus) {
      this.dialog.closeAll();
    }
  }

  /**
   * Metodo para validar status de carga de tallas
   * @param {*} [result]
   * @memberof SizesComponent
   */
  verifyStateCharge(result?: any) {
    if (result) {
      if (result.body.data.response) {
        result.body.data.response = JSON.parse(result.body.data.response);
      }
      if (result.body.data.status === 0 || result.body.data.checked === 'true') {
        clearInterval(this.checkIfDoneCharge);
        this.progressStatus = false;
      } else if (result.body.data.status === 1 || result.body.data.status === 4) {
        result.body.data.status = 1;
        if (!this.progressStatus) {
          this.openDialogSendOrder(result);
        }
        this.progressStatus = true;
      } else if (result.body.data.status === 2) {
        console.log('result: ', result.body.data.response.SizesNotify);
        this.dataIfError = result.body.data.response.SizesNotify;
        this.loadingService.closeSpinner();
        clearInterval(this.checkIfDoneCharge);
        this.closeActualDialog();
        this.chargeSizesOk();
      } else if (result.body.data.status === 3) {
        this.closeActualDialog();
        clearInterval(this.checkIfDoneCharge);
        this.snackBar.open(this.languageService.instant('secure.products.create_product_unit.list_products.error_delete'), this.languageService.instant('actions.close'), {
          duration: 3000,
        });
      }
    } else {
      this.modalService.showModal('errorService');
    }
  }

/**
 * Mertodo para abrir modal de carga en proceso
 * @memberof SizesComponent
 */
  openDialogSendOrder(res: any): void {
    console.log(99, res.body.data.status);
    const dialogRef = this.dialog.open(FinishUploadProductInformationComponent, {
      width: '95%',
      disableClose: res.body.data.status === 1,
      data: {
        response: res
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      log.info('The dialog was closed');
    });
  }

  /**
   * Metodo para cargar las tallas abriendo modal con info
   * @memberof SizesComponent
   */
  chargeSizesOk() {
    const title1 = this.keySize.length < 2 ? 'Se ha creado ' : 'Se han creado ';
    const title2 = this.keySize.length < 2 ? 'talla exitosamente ' : ' tallas exitosamente';
    const message = this.keySize.length < 2 ? ' talla ha tenido un error y no han sido creada, revisa la siguiente información.' : ' tallas han tenido un error y no han sido creadas, revisa la siguiente información.';
    this.dataDialog = {
      title: title1 + this.keySize.length + title2,
      icon: 'done',
      message: this.dataIfError.length + message,
      buttonText: {
        accept: this.languageService.instant('actions.accept')
      },
      dataError: this.dataIfError
    };
    this.openDialogGenericInfo();
  }

  /**
   * Funcion apra abrir modal eliminar y pasar info
   * @param {*} element
   * @memberof SizesComponent
   */
  deleteSizeDialog(element: any) {
    this.dataDialog = {
      title: '¡Vas a eliminar la talla creada!',
      icon: 'delete',
      message: '¿Estas seguro de eliminar la talla?',
      buttonText: {
        delete: this.languageService.instant('permissions.ELIMINAR'),
        cancel: this.languageService.instant('actions.cancel')
      },
      dataError: this.dataIfError
    };
    this.openDialogGenericInfo(element);
  }

  openDialogGenericInfo(param?: any) {
    const dialogRef = this.dialog.open(DialogInfoComponent, {
        width: '60%',
        minWidth: '280px',
        data: this.dataDialog
    });
    dialogRef.afterClosed().subscribe(result => {
    console.log(result);
        if (result === true) {
            this.deleteSize(param);
        } else {
            // this.activeCheck = false;
            this.listSize();
        }
        log.info('The modal detail billing was closed');
    });
}

}
