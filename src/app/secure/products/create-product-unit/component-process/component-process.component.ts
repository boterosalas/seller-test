import { Component, OnInit, Input, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-component-process',
  templateUrl: './component-process.component.html',
  styleUrls: ['./component-process.component.scss']
})
export class ComponentProcessComponent implements OnInit {
  // isLinear = false;
  /* eanCtrl: FormGroup;
  categoryCtrl: FormGroup;
  basicInfoCtrl: FormGroup;
  especificCtrl: FormGroup;
  imageCtrl: FormGroup; */
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
  editFirstStep = true;
  public user: UserInformation;
  @Input() ean: string;
  detailProduct: any;
  editProduct = false;
  @ViewChild('stepper') stepper: MatStepper;

  constructor(private fb: FormBuilder,
    private loadingService: LoadingService,
    private process: ProcessService,
    public dialog: MatDialog,
    public router: Router,
    public userParams: UserParametersService,
    private productsService: ListProductService,
    private service: EanServicesService,
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
    if (this.ean) {
      this.stepper.selectedIndex = 1;
      this.editFirstStep = false;
      this.isLinear = false;
      this.service.validateEan(this.ean).subscribe(res => {
        if (res['data']) {
           this.productsService.getListProductsExpanded(this.ean).subscribe((result: any) => {
          if (result && result.data.list.brand) {
            this.detailProduct = result.data.list;
          }
        });
        } else {
          this.detailProduct = null;
          this.router.navigate([`/`]);
        }
      });
    } else {
      this.stepper.selectedIndex = 0;
      this.isLinear = true;
      this.editFirstStep = true;
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
      if (data.sellerProfile !== this.constantes.seller) {
        this.router.navigate([`/${RoutesConst.home}`]);
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
      if (event && event.previouslySelectedStep && event.previouslySelectedStep.completed !== true ) {
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
    if (this.eanFormGroup.valid && this.categoryFormGroup.valid && this.basicInfoFormGroup.valid && this.especificFormGroup.valid && this.imageFormGroup.valid ) {
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
      this.process.saveInformationUnitreation().subscribe(result => {
        const data = result;
        this.loadingService.closeSpinner();
        this.saving = false;
        if (data['data'] !== null && data['data'] !== undefined) {
          if (data['data'].error === 0) {
            this.process.resetProduct();
          }
          this.openDialogSendOrder2(data);
        }
      }, error => {
        this.saving = false;
        this.loadingService.closeSpinner();
      });
    }
  }

  /**
   * Funcion: openDialogSendOrder2
   * Funcion para desplegar el modal de exitoso o con los errores del guardado de la creacion unitaria.
   * @param {*} res
   * @memberof ComponentProcessComponent
   */
  openDialogSendOrder2(res: any): void {
    if (!res.data) {
      res.productNotifyViewModel = res.data.productNotify;
    } else {
      // Condicional apra mostrar errores mas profundos. ;
      if (res.data) {
        res.productNotifyViewModel = res.data.productNotify;
      }
    }
    const dialogRef = this.dialog.open(SaveProcessDialogComponent, {
      width: '95%',
      disableClose: true,
      data: {
        response: res
      },
    });
    dialogRef.afterClosed().subscribe(resdialog => {
    });
  }
}

