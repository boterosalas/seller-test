import { Component, OnInit, Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators } from '@angular/forms';
import { ProcessService } from './component-process.service';
import { SaveProcessDialogComponent } from './dialogSave/dialogSave.component';
import { MatDialog, MatStepper } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { LoadingService } from '@app/core/global/loading/loading.service';
import { Const, RoutesConst, UserInformation } from '@app/shared';
import { Router } from '@angular/router';
import { UserParametersService, UserLoginService } from '@app/core';
import { ListProductService } from '../../list-products/list-products.service';
import { EanServicesService } from '../validate-ean/ean-services.service';
import { TranslateService } from '@ngx-translate/core';
import { FinishUploadInformationComponent } from '@app/secure/offers/bulk-load/finish-upload-information/finish-upload-information.component';
import { PendingProductsService } from '../../pending-products/pending-products.service';


@Component({
  selector: 'app-component-process',
  templateUrl: './component-process.component.html',
  styleUrls: ['./component-process.component.scss']
})
export class ComponentProcessComponent implements OnInit {

  isLinear = true;
  eanFormGroup: FormGroup;
  categoryFormGroup: FormGroup;
  basicInfoFormGroup: FormGroup;
  especificFormGroup: FormGroup;
  imageFormGroup: FormGroup;
  options: FormGroup;
  isOptional = true;
  views: any;
  children_created: any = 0;
  modalService: any;
  constantes = new Const();
  saving = false;
  isAdmin = false;
  editFirstStep = true;
  public user: UserInformation;
  @Input() ean: string;
  @Input() reference: any;
  @Input() pendingProduct: any;
  detailProduct: any;
  editProduct = false;
  intervalTime = 6000;
  public listErrorStatus: any = [];
  @ViewChild('stepper', {static: false}) stepper: MatStepper;
  user2: UserInformation;
  idProductProcess = null;

  constructor(private fb: FormBuilder,
    private loadingService: LoadingService,
    private process: ProcessService,
    public dialog: MatDialog,
    public router: Router,
    public userParams: UserParametersService,
    private productsService: ListProductService,
    private service: EanServicesService,
    private cdr: ChangeDetectorRef,
    private languageService: TranslateService,
    private pendingProductsService: PendingProductsService,
    public userService: UserLoginService) {
    this.options = fb.group({
      hideRequired: false,
      floatLabel: 'auto',
    });
  }

  /**
   * Cuando se inicializa el componente verifica si esta logeado y si es VENDEDOR.
   * despues iniciliza el formulario de cada una de las vistas.
   *
   * @memberof ComponentProcessComponent
   */
  ngOnInit() {
    this.process.resetProduct();
    this.userService.isAuthenticated(this);
    this.eanFormGroup = this.fb.group({
      eanCtrl: ['', Validators.required]
    });
    this.categoryFormGroup = this.fb.group({
      categoryCtrl: ['', Validators.required]
    });
    this.basicInfoFormGroup = this.fb.group({
      basicInfoCtrl: ['', Validators.required]
    });
    this.especificFormGroup = this.fb.group({
      especificCtrl: ['', Validators.required]
    });
    this.imageFormGroup = this.fb.group({
      imageCtrl: ['', Validators.required]
    });
    this.process.change.subscribe(data => {
      this.views = data;
      this.validateView();
    });
    this.getDetailProduct();
  }

  getDetailProduct() {
    if (this.pendingProduct) {
      if (this.ean) {
        this.stepper.selectedIndex = 1;
        this.editFirstStep = false;
        this.isLinear = false;
        if (this.reference === '' || this.reference === null || this.reference === ' ') {
          this.reference = 'null';
        }
        const params = localStorage.getItem('userId') + '/' + this.ean + '/' + this.reference;
        this.pendingProductsService.getEANProductsModify(params).subscribe((result: any) => {
          if (result && result.data.brand) {
            this.detailProduct = result.data;
            this.detailProduct.reference = this.reference;
          }
          this.idProductProcess = result.data.idProductProcess;
        });
      }
    } else {
      if (this.ean) {
        this.stepper.selectedIndex = 1;
        this.editFirstStep = false;
        this.isLinear = false;
        this.service.validateEan(this.ean).subscribe(res => {
          if (res['data']) {
            if (this.reference === '' || this.reference === null || this.reference === ' ') {
              this.reference = 'null';
            }
            const params = this.ean + '/' + this.reference;
            this.productsService.getProductsDetails(params).subscribe((result: any) => {
              if (result && result.data.brand) {
                this.detailProduct = result.data;
                this.detailProduct.reference = this.reference;
              }
            });
          } else {
            this.detailProduct = null;
          }
        });
      } else {
        this.stepper.selectedIndex = 0;
        this.isLinear = true;
        this.editFirstStep = true;
      }
    }


  }

  /**
   * Valida si el usuario esta logueado y despues si es un VENDEDOR
   *
   * @param {string} message
   * @param {boolean} isLoggedIn
   * @memberof ComponentProcessComponent
   */
  isLoggedIn(message: string, isLoggedIn: boolean) {
    if (isLoggedIn) {
      this.getDataUser();
    } else if (!isLoggedIn) {
      this.router.navigate([`/${RoutesConst.home}`]);
    }
  }

  async getDataUser() {
    this.userParams.getUserData().then(data => {
      this.user2 = data;
      if (data.sellerProfile !== this.constantes.seller) {
        this.isAdmin = true;
        if (this.ean === undefined) {
          this.isAdmin = false;
          this.router.navigate([`/${RoutesConst.home}`]);
        }
      }
    });
  }

  public continue_after_basic_info() {
    if (this.process.getProductData().Children) {
      this.children_created = this.process.getProductData().Children.length;
    }
  }

  public stepClick(event: any): void {
    try {
      if (event && event.previouslySelectedStep && event.previouslySelectedStep.completed !== true) {
        event.previouslySelectedStep.completed = true;
      }
      if (event && event.selectedIndex === 2) {
        document.getElementsByClassName('mat-horizontal-content-container')[0].scrollTop = 0;
      }
    } catch (e) {
      return null;
    }
  }


  public validateView(): void {
    if (this.views.showEan) {
      this.eanFormGroup.controls.eanCtrl.setValue('1');
    } else if (!this.views.showEan) {
      this.eanFormGroup.controls.eanCtrl.setValue(null);
    }
    if (this.views.showCat) {
      this.categoryFormGroup.controls.categoryCtrl.setValue('1');
    } else if (!this.views.showCat) {
      this.categoryFormGroup.controls.categoryCtrl.setValue(null);
    }
    if (this.views.showInfo) {
      this.basicInfoFormGroup.controls.basicInfoCtrl.setValue('1');
    } else if (!this.views.showInfo) {
      this.basicInfoFormGroup.controls.basicInfoCtrl.setValue(null);
    }
    if (this.views.showSpec) {
      this.especificFormGroup.controls.especificCtrl.setValue('1');
    } else if (!this.views.showSpec) {
      this.especificFormGroup.controls.especificCtrl.setValue(null);
    }
    if (this.views.showImg) {
      this.imageFormGroup.controls.imageCtrl.setValue('1');
    } else if (!this.views.showImg) {
      this.imageFormGroup.controls.imageCtrl.setValue(null);
    }
    if (this.eanFormGroup.valid && this.categoryFormGroup.valid && this.basicInfoFormGroup.valid && this.especificFormGroup.valid && this.imageFormGroup.valid) {
      this.isLinear = false;
    } else {
      this.isLinear = true;
    }

  }

  /**
   * Funtion saveInformationCreation()
   * Funcion para guardar la información de la creación unitaria.
   * @memberof ComponentProcessComponent
   */
  saveInformationCreation() {
    this.loadingService.viewSpinner();
    // call to the bulk load product service
    if (!this.saving) {
      this.saving = true;
      this.process.saveInformationUnitreation(this.ean, this.idProductProcess).subscribe(result => {
        const data = result;
        if (this.isAdmin) {
          this.verificateStatus();
        } else {
          if (result && result['body'] && result['body'].data && result['body'].data.productNotify) {
            if (result['body'].data.error === 0) {
              this.process.resetProduct();
            }
            this.openDialogSendOrder2(result['body'].data.productNotify, result['body'].data.error, this.ean);
          } else if (result && result['data']) {
            if (result['data'].error === 0) {
              this.process.resetProduct();
            }
            this.openDialogSendOrder2(data['data'].productNotify, result['data'].error, this.ean);
          }
        }
        this.loadingService.closeSpinner();
        this.saving = false;
      }, error => {
        this.saving = false;
        this.loadingService.closeSpinner();
      });
    }
  }

  verificateStatus() {
    this.process.setStatusChange().subscribe((res) => {
      try {
        if (res && res.status) {
          const { status, checked } = res.body.data;
          if ((status === 1 || status === 4) && checked !== 'true') {
            const statusCurrent = 1;
            setTimeout(() => { this.validateStatus(statusCurrent, null); });
          } else if (status === 2 && checked !== 'true') {
            setTimeout(() => { this.validateStatus(status, null); });
          } else if (status === 3 && checked !== 'true') {
            const response = res.body.data.response;
            if (response) {
              this.listErrorStatus = JSON.parse(response).Data.ProductNotify;
            } else {
              this.listErrorStatus = null;
            }
            setTimeout(() => { this.validateStatus(status, this.listErrorStatus); });
          } else {
            this.loadingService.closeSpinner();
          }
        }
      } catch {
        this.loadingService.viewSpinner();
        this.modalService.showModal('errorService');
      }
    });
  }

  validateStatus(type: any, listError: any) {
    this.loadingService.closeSpinner();
    this.intervalTime = 6000;
    const data = {
      successText: this.languageService.instant('modal.success.update.title'),
      failText: this.languageService.instant('secure.products.Finish_upload_product_information.when_uploading_products'),
      processText: this.languageService.instant('secure.products.Finish_upload_product_information.upload_progress'),
      initTime: 500,
      intervalTime: this.intervalTime,
      listError: listError,
      typeStatus: type,
      responseDiferent : false
    };
    this.cdr.detectChanges();
    const dialog = this.dialog.open(FinishUploadInformationComponent, {
      width: '70%',
      minWidth: '280px',
      maxHeight: '80vh',
      disableClose: type === 1,
      data: data
    });
    const dialogIntance = dialog.componentInstance;
    dialogIntance.request = this.process.setStatusChange();
    dialogIntance.processFinish$.subscribe((val) => {
      dialog.disableClose = false;
    });
  }

  /**
   * Funcion: openDialogSendOrder2
   * Funcion para desplegar el modal de exitoso o con los errores del guardado de la creacion unitaria.
   * @param {*} res
   * @memberof ComponentProcessComponent
   */
  openDialogSendOrder2(res: any, error: any, ean: any): void {
    const sendModal = {
      productNotifyViewModel: res,
      error: error,
      ean: ean
    };
    const dialogRef = this.dialog.open(SaveProcessDialogComponent, {
      width: '95%',
      disableClose: true,
      data: {
        response: sendModal
      },
    });
    dialogRef.afterClosed().subscribe(resdialog => {
    });
  }
}

