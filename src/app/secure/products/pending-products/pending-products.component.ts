import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginatorIntl, MatPaginator, ErrorStateMatcher, PageEvent } from '@angular/material';
import { MatPaginatorI18nService } from '@app/shared/services/mat-paginator-i18n.service';
import { readFunctionality, unitaryCreateName, MenuModel } from '@app/secure/auth/auth.consts';
import { FormGroupDirective, NgForm, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Logger, LoadingService, UserParametersService } from '@app/core';
import { SupportService } from '@app/secure/support-modal/support.service';
import { PendingProductsService } from './pending-products.service';
import { UserInformation } from '@app/shared';
import { AuthService } from '@app/secure/auth/auth.routing';

export interface ListFilterProductsModify {
  name: string;
  value: string;
  nameFilter: string;
}
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

const log = new Logger('PendingProductsComponent');

@Component({
  selector: 'app-pending-products',
  templateUrl: './pending-products.component.html',
  styleUrls: ['./pending-products.component.scss'],
  providers: [
    {
      provide: MatPaginatorIntl,
      useClass: MatPaginatorI18nService,
    }
  ],
})
export class PendingProductsComponent implements OnInit {
  productsList: any = [];
  productsList2: any = [];

  read = readFunctionality;
  validateRegex: any;
  public filterProdutsPending: FormGroup;
  public filterProdutsValidation: FormGroup;

  public pageSize = 30;
  public pageSize2 = 30;
  public idSeller = '';
  public sellerId: any;

  public user: UserInformation;
  isAdmin = false;

  showProducts = false;
  eanVariable = false;
  nameVariable = false;

  nameProductList: any;
  eanList: any;

  nameProductList2: any;
  eanList2: any;

  listFilterProductsModify: ListFilterProductsModify[] = [];
  listFilterProductsValidation: ListFilterProductsModify[] = [];

  dataChips: Array<any> = [];
  dataChips2: Array<any> = [];


  removable = true;

  length = 0;
  length2 = 0;
  pageSizeOptions: number[] = [30, 60, 120, 600];
  pageSizeOptions2: number[] = [30, 60, 120, 600];
  pageEvent: PageEvent;

  editPermission = false;
  permissionComponent: MenuModel;

  public callOne = true;
  public arrayPosition = [];
  public paginationToken = '{}';
  public callOne2 = true;
  public arrayPosition2 = [];
  public paginationToken2 = '{}';
  public limit = 30;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  paramsArray: { limit: string; idSeller: string; };
  paramsArray2: { limit: string; idSeller: string; };
  ean = '';
  nameProduct = '';
  ean2 = '';
  nameProduct2 = '';

  separatorKeysCodes: number[] = [];

  indexTab: number;
  constructor(
    private pendingProductsService: PendingProductsService,
    public userParams: UserParametersService,
    private loadingService: LoadingService,
    public SUPPORT?: SupportService,
    private fb?: FormBuilder,
    public authService?: AuthService,
  ) {
    this.getDataUser();
  }

  ngOnInit() {
    this.validateFormSupport();
    this.getPendingProductsModify();
    this.getPendingProductsValidation();
    this.editPermission = this.authService.getPermissionForMenu(unitaryCreateName, 'Editar');
  }

  /**
   * Función para traer informacion del usuario
   */
  async getDataUser() {
    this.user = await this.userParams.getUserData();
    if (this.user.sellerProfile === 'seller') {
      this.sellerId = this.user.sellerId;
      this.permissionComponent = this.authService.getMenuProfiel(unitaryCreateName, 0);
      this.setPermission(0);
    } else {
      this.permissionComponent = this.authService.getMenuProfiel(unitaryCreateName, 1);
      this.setPermission(1);
      this.isAdmin = true;
    }
  }

  /**
   * Seteo permiso para editar
   * @param {number} typeProfile
   * @memberof PendingProductsComponent
   */
  setPermission(typeProfile: number) {
    this.editPermission = this.getFunctionality('Editar');

  }

  /**
   * Metodo para obtener los permisos y funcionabilidades del menu
   * @param {string} [functionality]
   * @returns {boolean}
   * @memberof PendingProductsComponent
   */
  public getFunctionality(functionality?: string): boolean {
    const permission = this.permissionComponent.Functionalities.find(result => functionality === result.NameFunctionality);
    return permission && permission.ShowFunctionality;
  }

  /**
   * Metodo para crear el formulario productos pendiente modificacion
   * @memberof PendingProductsComponent
   */
  createFormControls() {
    this.filterProdutsPending = this.fb.group({
      productName: new FormControl('', Validators.compose([Validators.pattern(this.getValue('nameProduct'))])),
      ean: new FormControl(''),
      matcher: new MyErrorStateMatcher()
    });
  }

  /**
   * Metodo para crear form productos pendiente validación filtros
   * @memberof PendingProductsComponent
   */
  createFormControls2() {
    this.filterProdutsValidation = this.fb.group({
      productName2: new FormControl('', Validators.compose([Validators.pattern(this.getValue('nameProduct'))])),
      ean2: new FormControl(''),
      matcher: new MyErrorStateMatcher()
    });
  }

  // Funcion para cargar datos de regex
  public validateFormSupport(): void {
    const param = ['productos', null];
    this.SUPPORT.getRegexFormSupport(param).subscribe(res => {
      this.validateRegex = JSON.parse(res.body.body);
      this.createFormControls();
      this.createFormControls2();
      // this.filterListProducts();
    });
  }

  /**
   * Funcion para obtener el valor de la regex
   * @param {string} name
   * @returns {string}
   * @memberof PendingProductsComponent
   */
  public getValue(name: string): string {
    for (let i = 0; i < this.validateRegex.Data.length; i++) {
      if (this.validateRegex.Data[i].Identifier === name) {
        return this.validateRegex.Data[i].Value;
      }
    }
    return null;
  }

  /**
   * Metodo para consultar el listado de productos pdte modificación
   * @param {*} [params]
   * @memberof PendingProductsComponent
   */
  getPendingProductsModify(params?: any, limit?: any) {
    // this.rejected = true;
    this.loadingService.viewSpinner();
    if (params !== undefined) {
      if (limit === undefined) {
        limit = this.pageSize;
      }
      this.paginationToken = encodeURI(this.paginationToken);
      this.paramsArray = {
        'limit': limit + '&paginationToken=' + this.paginationToken,
        'idSeller': this.user.sellerId + '&ean=' + this.ean + '&name=' + this.nameProduct
      };
    } else {
      this.paramsArray = {
        'limit': this.pageSize + '&paginationToken=' + encodeURI(this.paginationToken),
        'idSeller': this.user.sellerId + '&ean=' + this.ean + '&name=' + this.nameProduct
      };
    }
    this.showProducts = false;
    this.pendingProductsService.getPendingProductsModify(this.paramsArray).subscribe((res: any) => {
      if (res) {
        if (this.callOne) {
          this.length = res.count;
          this.arrayPosition = [];
          this.arrayPosition.push('{}');
          this.callOne = false;
        }
        this.showProducts = true;
        this.productsList = res.viewModel;
        this.paginationToken = res.paginationToken;
        this.loadingService.closeSpinner();
      }
      this.filterProductsModify();
      this.loadingService.closeSpinner();

    });
  }

  /**
   * Metodo para obtener los productos pendientes de validación
   * @param {*} [params]
   * @memberof PendingProductsComponent
   */
  getPendingProductsValidation(params?: any) {
    // this.validation = true;
    this.loadingService.viewSpinner();
    if (params !== undefined) {
      this.paginationToken2 = encodeURI(this.paginationToken2);
      this.paramsArray2 = {
        'limit': this.pageSize2 + '&paginationToken=' + this.paginationToken2,
        'idSeller': this.user.sellerId + '&ean=' + this.ean2 + '&name=' + this.nameProduct2
      };
    } else {
      this.paramsArray2 = {
        'limit': this.pageSize2 + '&paginationToken=' + encodeURI(this.paginationToken2),
        'idSeller': this.user.sellerId + '&ean=' + this.ean2 + '&name=' + this.nameProduct2
      };
    }
    this.showProducts = false;
    this.pendingProductsService.getPendingProductsValidation(this.paramsArray2).subscribe((res: any) => {
      if (res) {
        if (this.callOne2) {
          this.length2 = res.count;
          this.arrayPosition2 = [];
          this.arrayPosition2.push('{}');
          this.callOne2 = false;
        }
        this.showProducts = true;
        this.productsList2 = res.viewModel;
        this.paginationToken2 = res.paginationToken;
        this.loadingService.closeSpinner();
      }
      this.filterProductsModify2();
    });
  }

  /**
   * Metodo de paginación productos pendientes modificación
   * @param {*} event
   * @memberof PendingProductsComponent
   */
  paginations(event: any): any {
    if (event.pageSize !== this.limit) {
      this.limit = event.pageSize;
    }
    if (event && event && event.pageIndex >= 0) {
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
      this.paramsArray = {
        'limit': this.limit + '&paginationToken=' + this.paginationToken,
        'idSeller': this.user.sellerId + '&ean=' + this.ean + '&name=' + this.nameProduct
      };
      this.getPendingProductsModify(this.paramsArray, this.limit);
    }
  }

  /**
   * Metodo paginacion productos pendiente validación
   * @param {*} event
   * @memberof PendingProductsComponent
   */
  paginations2(event: any): any {
    if (event.pageSize !== this.limit) {
      this.limit = event.pageSize;
    }
    if (event && event && event.pageIndex >= 0) {
      const index = event.pageIndex;
      if (index === 0) {
        this.paginationToken2 = encodeURI('{}');
      }
      const isExistInitial = this.arrayPosition2.includes('{}');
      if (isExistInitial === false) {
        this.arrayPosition2.push('{}');
      }
      const isExist = this.arrayPosition2.includes(this.paginationToken2);
      if (isExist === false) {
        this.arrayPosition2.push(this.paginationToken2);
      }
      this.paginationToken2 = this.arrayPosition2[index];
      if (this.paginationToken2 === undefined) {
        this.paginationToken2 = encodeURI('{}');
      }
      this.paramsArray2 = {
        'limit': this.pageSize2 + '&paginationToken=' + this.paginationToken2,
        'idSeller': this.user.sellerId + '&ean=' + this.ean2 + '&name=' + this.nameProduct2
      };
      this.getPendingProductsModify(this.paramsArray2);
    }
  }

  /**
   * Metodo para obtener el listado de productos pdtes modificacion
   * @memberof PendingProductsComponent
   */
  getAllPendingProducts() {
    this.paramsArray = {
      'limit': this.pageSize + '&paginationToken=' + encodeURI('{}'),
      'idSeller': this.user.sellerId + '&ean=' + null + '&name=' + null
    };
    this.getPendingProductsModify(this.paramsArray);
  }

  getAllPendingProductsValidattion() {
    this.paramsArray2 = {
      'limit': this.pageSize2 + '&paginationToken=' + encodeURI('{}'),
      'idSeller': this.user.sellerId + '&ean=' + null + '&name=' + null
    };
    this.getPendingProductsValidation(this.paramsArray2);
  }

  /**
   * Metodo para cerrar el filtro de productos pendientes modificacion
   * @memberof PendingProductsComponent
   */
  public closeFilter() {
    if (!this.eanVariable) {
      this.filterProdutsPending.controls.ean.setValue('');
      this.eanList = null;
    }
    if (!this.nameVariable) {
      this.filterProdutsPending.controls.productName.setValue('');
      this.nameProductList = null;
    }
    this.getAllPendingProducts();
  }

  /**
   * Metodo para cerrar el filtro de productos pendientes validación
   * @memberof PendingProductsComponent
   */
  public closeFilter2() {
    if (!this.eanVariable) {
      this.filterProdutsValidation.controls.ean2.setValue('');
      this.eanList2 = null;
    }
    if (!this.nameVariable) {
      this.filterProdutsValidation.controls.productName2.setValue('');
      this.nameProductList2 = null;
    }
    this.getAllPendingProductsValidattion();
  }

  /**
   * Metodo para aplicar filtros productos pndtes modificacion
   * @memberof PendingProductsComponent
   */
  public filterApply() {
    this.callOne = true;
    this.ean = encodeURIComponent(this.filterProdutsPending.controls.ean.value);
    this.nameProduct = encodeURIComponent(this.filterProdutsPending.controls.productName.value);
    this.paginationToken = '{}';
    this.paramsArray = {
      'limit': this.pageSize + '&paginationToken=' + encodeURI('{}'),
      'idSeller': this.user.sellerId + '&ean=' + this.ean + '&name=' + this.nameProduct
    };
    this.getPendingProductsModify(this.filterProdutsPending);
  }

  /**
   * Metodo para aplicar filtros productos pndtes validacion
   * @memberof PendingProductsComponent
   */
  public filterApply2() {
    this.paginationToken2 = '{}';
    this.callOne2 = true;
    this.ean2 = encodeURIComponent(this.filterProdutsValidation.controls.ean2.value);
    this.nameProduct2 = encodeURIComponent(this.filterProdutsValidation.controls.productName2.value);
    this.paramsArray = {
      'limit': this.pageSize + '&paginationToken=' + encodeURI('{}'),
      'idSeller': this.user.sellerId + '&ean=' + this.ean2 + '&name=' + this.nameProduct2
    };
    this.getPendingProductsValidation(this.filterProdutsValidation);
  }

  /**
   * Metodo para limpiar formualrio y llamar servicio principal productos rechazados
   * @memberof PendingProductsComponent
   */
  public cleanFilter() {
    this.filterProdutsPending.reset();
    this.filterApply();
    this.cleanFilterListProductsModify();
  }

  /**
   *  Metodo para limpiar formualrio y llamar servicio principal productos validacion
   * @memberof PendingProductsComponent
   */
  public cleanFilter2() {
    this.filterProdutsValidation.reset();
    this.filterApply2();
    this.cleanFilterListProductsModify2();
  }

  public cleanFilterListProductsModify(): void {
    this.nameProductList = null;
    this.eanList = null;
    this.listFilterProductsModify = [];
  }

  public cleanFilterListProductsModify2(): void {
    this.nameProductList2 = null;
    this.eanList2 = null;
    this.listFilterProductsValidation = [];
  }

  /**
   * Metodo para aplicar filtros productos rechazados
   * @memberof PendingProductsComponent
   */
  public filterProductsModify() {
    this.cleanFilterListProductsModify();
    this.nameProductList = this.filterProdutsPending.controls.productName.value || null;
    this.eanList = this.filterProdutsPending.controls.ean.value || null;

    // const data = [];
    this.dataChips.push({ value: this.nameProductList, name: 'nameProductList', nameFilter: 'productName' });
    this.dataChips.push({ value: this.eanList, name: 'eanList', nameFilter: 'ean' });
    this.add(this.dataChips);
  }

  /**
   * Metodo para aplicar filtros productos validacion
   * @memberof PendingProductsComponent
   */
  public filterProductsModify2() {
    this.cleanFilterListProductsModify();
    this.nameProductList2 = this.filterProdutsValidation.controls.productName2.value || null;
    this.eanList2 = this.filterProdutsValidation.controls.ean2.value || null;

    // const data = [];
    this.dataChips2.push({ value: this.nameProductList2, name: 'nameProductList2', nameFilter: 'productName2' });
    this.dataChips2.push({ value: this.eanList2, name: 'eanList2', nameFilter: 'ean2' });
    this.add2(this.dataChips2);
  }

  /**
   * Metodo para ir eliminando chips de filtros productos rechazados
   * @param {ListFilterProductsModify} productsFilterModify
   * @memberof PendingProductsComponent
   */
  public remove(productsFilterModify: ListFilterProductsModify): void {

    const index = this.listFilterProductsModify.indexOf(productsFilterModify);

    if (index >= 0) {
      this.listFilterProductsModify.splice(index, 1);
      this[productsFilterModify.value] = '';
      this.filterProdutsPending.controls[productsFilterModify.nameFilter].setValue(null);
    }
    this.filterApply();
  }

  /**
   * Metodo para ir eliminando chips de filtros productos validación
   * @param {ListFilterProductsModify} productsFilterValidation
   * @memberof PendingProductsComponent
   */
  public removeValidation(productsFilterValidation: ListFilterProductsModify): void {
    const index = this.listFilterProductsValidation.indexOf(productsFilterValidation);

    if (index >= 0) {
      this.listFilterProductsValidation.splice(index, 1);
      this[productsFilterValidation.value] = '';
      this.filterProdutsValidation.controls[productsFilterValidation.nameFilter].setValue(null);
    }
    this.filterApply2();
  }

  /**
   * Metodo para añadir los chips de los filtros rechazados
   * @param {*} data
   * @memberof PendingProductsComponent
   */
  public add(data: any): void {
    data.forEach(element => {
      const value = element.value;
      if (value) {
        if ((value || '')) {
          this.listFilterProductsModify.push({ name: element.value, value: element.name, nameFilter: element.nameFilter });
        }

      }
    });
    this.dataChips = [];
  }

  /**
   * Metodo para añadir los chips de los filtros validacion
   * @param {*} data
   * @memberof PendingProductsComponent
   */
  public add2(data: any): void {
    data.forEach(element => {
      const value = element.value;
      if (value) {
        if ((value || '')) {
          this.listFilterProductsValidation.push({ name: element.value, value: element.name, nameFilter: element.nameFilter });
        }

      }
    });
    this.dataChips2 = [];
  }



  /**
   * Mirar evento del matTab
   * @param {*} event
   * @memberof PendingProductsComponent
   */
  setMatTab(event: any) {
    this.indexTab = 0;
    if (event.index === 0) {
      this.indexTab = event.index;
    } else if (event.index === 1) {
      this.indexTab = event.index;
    }
  }


}


