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
  @Input() productsList: any;
  @Input() showProducts: boolean;
  @Input() offerPermission: boolean;
  @Input() editPermission: boolean;
  @Input() isAdmin: boolean;
  @Output() reloadData = new EventEmitter<any>();

  public productsExpanded: any;
  public showImage = false;



  constructor(
    private productsService?: ListProductService,
    private loadingService?: LoadingService,
    public snackBar?: MatSnackBar,

  ) { }

  ngOnInit() {
    // Esto se ejecuta cuando alguien cambia el change del servicio
    this.productsService.change.subscribe(data => {
      if (!data) {
        this.backTolist();
      }
    });
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
}
