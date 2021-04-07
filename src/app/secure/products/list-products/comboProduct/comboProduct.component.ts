import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy, EventEmitter, Output } from '@angular/core';
import { Logger } from '@app/core/util/logger.service';
import { ListProductService } from '../list-products.service';
import { LoadingService } from '@app/core';
import { MatSnackBar } from '@angular/material';

const log = new Logger('ComboProductComponent');

/**
 * @title Card with multiple sections
 */
@Component({
  selector: 'app-combo-product',
  templateUrl: 'comboProduct.component.html',
  styleUrls: ['comboProduct.component.scss'],
})
export class ComboProductComponent implements OnInit, OnChanges, OnDestroy {
  // productsList: any;
  // @Input() productsList: any;
  @Input() showProducts: boolean;
  @Input() offerPermission: boolean;
  @Input() editPermission: boolean;
  @Input() isAdmin: boolean;
  @Input() activeCheck: boolean;
  @Input() deletePermission: boolean;
  @Output() reloadData = new EventEmitter<any>();
  @Output() countPlu = new EventEmitter();

  public _listProduct: any;
  @Input() set productsList(value: any) {
    if (value) {
      console.log(value);
        this._listProduct = value;
        this.setCheckedTrue();
    }
}

  public productsExpanded: any;
  public showImage = false;
  sumItemCountProduct: number;
  public listProducts: any[];
  listToSend = [];


  constructor(
    private productsService?: ListProductService,
    private loadingService?: LoadingService,
    public snackBar?: MatSnackBar,

  ) { }

  ngOnInit() {
    this.setCheckedTrue();
    // Esto se ejecuta cuando alguien cambia el change del servicio
    this.productsService.change.subscribe(data => {
      if (!data) {
        this.backTolist();
      }
    });
  }

  /**
   * Metodo para checkear la oferta y no perderla al cambiar de pagina.
   * @memberof ComboProductComponent
   */
  setCheckedTrue() {
    this.listToSend.forEach(res => {
      console.log(res);
      this._listProduct.forEach(result => {
        if (result.pluVtex === res) {
          result['checked'] = true;
        }
      });
    });
  }

  /**
   * Metodo que recibe como parametro el item del nfgor de los card de productos
   * @param {*} statusOffer
   * @memberof ComboProductComponent
   */
  onvalueCheckdesactiveProducts(statusOffer: any) {
    statusOffer.checked = !statusOffer.checked;
    this.sumItemCountProduct = 0;
    this._listProduct.forEach(item => {
      if (item.checked) {
        this.listToSend.push(item.pluVtex);
      }
      if (item.checked === false) {
        this.listToSend.splice(item, 1);
      }
    });
    const newListArray = Array.from(new Set(this.listToSend));
    this.listToSend = newListArray;
    this.sumItemCountProduct = this.listToSend.length;
    this.sendCount();
  }

  ngOnDestroy(): void {
    this.productsService.change.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.showProducts && changes.showProducts.currentValue) {
      this.backTolist();
    }
  }

  /**
   * Funcion para poner el valor del producto expandido nulo.
   *
   * @memberof ComboProductComponent
   */
  public backTolist(): void {
    this.productsExpanded = null;
    this.showImage = false;
  }



  public openInformation(params?: any): void {
    this.loadingService.viewSpinner();
    this.productsService.getListProductsExpanded(params).subscribe((result: any) => {
      this.loadingService.closeSpinner();
      this.showImage = true;
      this.productsExpanded = result.data.list;
    });
  }

  public reloadDataListProduct() {
    this.reloadData.emit();
  }

  sendCount(){
    const info = {
      count: this.sumItemCountProduct,
      list: this.listToSend
    }
    this.countPlu.emit(info);
  }
}
