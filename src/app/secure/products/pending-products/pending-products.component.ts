import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginatorIntl, MatPaginator, ErrorStateMatcher } from '@angular/material';
import { MatPaginatorI18nService } from '@app/shared/services/mat-paginator-i18n.service';
import { readFunctionality } from '@app/secure/auth/auth.consts';
import { FormGroupDirective, NgForm, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Logger, LoadingService, UserParametersService } from '@app/core';
import { SupportService } from '@app/secure/support-modal/support.service';
import { PendingProductsService } from './pending-products.service';
import { UserInformation } from '@app/shared';


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

  public pageSize = 50;
  public idSeller = '';

  public user: UserInformation;
  isAdmin = false;

  showProducts = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
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
      initialDate: { disabled: true, value: '' },
      finalDate: { disabled: true, value: '' },
      creationDate: new FormControl('', []),
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

  getPendingProductsModify(params?: any) {
    console.log('params: ', params);
    this.loadingService.viewSpinner();
    // this.isClear = false;
    // this.params = this.setParameters(params);
    // let stateCurrent = null;
    // this.setCategoryName();
    this.showProducts = false;
    this.pendingProductsService.getPendingProductsModify(params).subscribe((res: any) => {
      if (res) {
        this.showProducts = true;
        this.productsList = res.viewModel;
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
  }

  getAllPendingProducts() {
    const paramsArray = {
      'limit': this.pageSize + '&paginationToken=' + encodeURI('{}'),
      'idSeller': this.user.sellerId
    };
    this.getPendingProductsModify(paramsArray);
  }

}
