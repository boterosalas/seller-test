import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Logger } from '@app/core/util/logger.service';
import { ListProductService } from '../list-products.service';
import { LoadingService } from '@app/core';

const log = new Logger('ComboProductComponent');

/**
 * @title Card with multiple sections
 */
@Component({
  selector: 'app-combo-product',
  templateUrl: 'comboProduct.component.html',
  styleUrls: ['comboProduct.component.scss'],
})
export class ComboProductComponent implements OnInit, OnChanges {
  // productsList: any;
  @Input() productsList: any;
  @Input() showProducts: boolean;

  public productsExpanded: any;
  public showImage = false;



  constructor(
    private productsService?: ListProductService,
    private loadingService?: LoadingService

  ) { }
  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.showProducts.currentValue) {
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
    console.log('parametro', params);
    this.loadingService.viewSpinner();
    this.productsService.getListProductsExpanded(params).subscribe((result: any) => {
      this.loadingService.closeSpinner();
      this.showImage = true;
      this.productsExpanded = result.data.list;
      console.log('info: ', this.productsExpanded);
    });
  }
}
