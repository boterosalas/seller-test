import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginatorIntl, MatPaginator, ErrorStateMatcher, PageEvent } from '@angular/material';
import { MatPaginatorI18nService } from '@app/shared/services/mat-paginator-i18n.service';
import { readFunctionality } from '@app/secure/auth/auth.consts';
import { FormGroupDirective, NgForm, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Logger, LoadingService, UserParametersService } from '@app/core';
import { SupportService } from '@app/secure/support-modal/support.service';
import { PendingProductsService } from './pending-products.service';
import { UserInformation } from '@app/shared';

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

  read = readFunctionality;
  validateRegex: any;
  public filterProdutsPending: FormGroup;

  public pageSize = 200;
  public idSeller = '';

  public user: UserInformation;
  isAdmin = false;

  showProducts = false;
  eanVariable = false;
  nameVariable = false;

  nameProductList: any;
  eanList: any;

  listFilterProductsModify: ListFilterProductsModify[] = [];

  dataChips: Array<any> = [];

  removable = true;

  length = 0;
  pageSizeOptions: number[] = [200, 300, 400];
  pageEvent: PageEvent;


  @ViewChild(MatPaginator) paginator: MatPaginator;
  paramsArray: { limit: string; idSeller: string; };
  constructor(
    private pendingProductsService: PendingProductsService,
    public userParams: UserParametersService,
    private loadingService: LoadingService,
    public SUPPORT?: SupportService,
    private fb?: FormBuilder,
  ) {
    this.getDataUser();
  }

  ngOnInit() {
    this.validateFormSupport();
    this.getAllPendingProducts();
  }

  /**
   * Función para traer informacion del usuario
   */
  async getDataUser() {
    this.user = await this.userParams.getUserData();
    if (this.user.sellerProfile === 'seller') {
    } else {
      this.isAdmin = true;
    }
  }

  /**
   * Metodo para crear el formulario
   * @memberof PendingProductsComponent
   */
  createFormControls() {
    this.filterProdutsPending = this.fb.group({
      productName: new FormControl('', Validators.compose([Validators.pattern(this.getValue('nameProduct'))])),
      ean: new FormControl(''),
      matcher: new MyErrorStateMatcher()
    });
  }

  // Funcion para cargar datos de regex
  public validateFormSupport(): void {
    const param = ['productos', null];
    this.SUPPORT.getRegexFormSupport(param).subscribe(res => {
      this.validateRegex = JSON.parse(res.body.body);
      this.createFormControls();
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
  getPendingProductsModify(params?: any) {
    console.log('params: ', params);
    this.loadingService.viewSpinner();
    // this.isClear = false;
    // this.params = this.setParameters(params);
    // let stateCurrent = null;
    // this.setCategoryName();
    this.showProducts = false;
    this.pendingProductsService.getPendingProductsModify(params).subscribe((res: any) => {
      console.log('res: ', res);
      if (res) {
        this.showProducts = true;
        this.productsList = res.viewModel;
        this.length = res.count;
        // if (params.state !== '') {
        //   stateCurrent = params.state;
        //   this.lastState = stateCurrent;
        // }
        // this.setTable(res);
        // if (params && params.callOne) {
        //   this.length = res.count;
        //   this.isClear = true;
        // }
        // const paginator = { 'pageIndex': 0 };
        // this.addCheckOptionInProduct(res.viewModel, paginator);
        this.loadingService.closeSpinner();
      }
    });
    this.filterProductsModify();
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

  public filterApply() {
    console.log(22, this.filterProdutsPending.controls);
    this.paramsArray = {
      'limit': this.pageSize + '&paginationToken=' + encodeURI('{}'),
      'idSeller': this.user.sellerId + '&ean=' + this.filterProdutsPending.controls.ean.value + '&name=' + this.filterProdutsPending.controls.productName.value
    };
    this.getPendingProductsModify(this.paramsArray);
    // this.pagepaginator = 0;
    // this.paginator.firstPage();
    // this.filterListProducts(param, true);
  }

  public cleanFilter() {
    this.filterProdutsPending.reset();
    this.getAllPendingProducts();
    this.cleanFilterListProductsModify();
  }

  public cleanFilterListProductsModify(): void {
    this.nameProductList = null;
    this.eanList = null;
    this.listFilterProductsModify = [];
  }

  public filterProductsModify() {
    this.cleanFilterListProductsModify();
    this.nameProductList = this.filterProdutsPending.controls.productName.value || null;
    this.eanList = this.filterProdutsPending.controls.ean.value || null;

    // const data = [];
    this.dataChips.push({ value: this.nameProductList, name: 'nameProductList', nameFilter: 'productName' });
    this.dataChips.push({ value: this.eanList, name: 'eanList', nameFilter: 'ean' });
    this.add(this.dataChips);
  }

  public remove(productsFilterModify: ListFilterProductsModify): void {

    const index = this.listFilterProductsModify.indexOf(productsFilterModify);

    if (index >= 0) {
      this.listFilterProductsModify.splice(index, 1);
      this[productsFilterModify.value] = '';
      this.filterProdutsPending.controls[productsFilterModify.nameFilter].setValue(null);
    }
    this.filterApply();
  }

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

  public changePaginatorProducts(param: any): any {
    this.pageSize = param.pageSize;
    this.getPendingProductsModify();
  }

}
