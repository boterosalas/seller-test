import { Component, OnInit } from '@angular/core';
import { Logger } from '@app/core/util/logger.service';
import { LoadingService, ModalService } from '@app/core';
import { ListProductService } from '../list-products.service';

const log = new Logger('ComboProductComponent');

/**
 * @title Card with multiple sections
 */
@Component({
  selector: 'app-combo-product',
  templateUrl: 'comboProduct.component.html',
  styleUrls: ['comboProduct.component.scss'],
})
export class ComboProductComponent implements OnInit {
  productsList: any;
  constructor(
    private loadingService?: LoadingService,
    private productsService?: ListProductService,
    private modalService?: ModalService,
  ) { }
  ngOnInit() {
    this.getListProducts();
  }

  getListProducts(params?: any) {
    this.loadingService.viewSpinner();
    this.productsService.getListProducts(params).subscribe((result: any) => {
      console.log('result: ', result);
      if (result.data !== undefined) {
        // const body = JSON.parse(result.data);
        this.productsList = result.data.list;
        console.log('productsList: ', this.productsList);
        // const response = result.body.data;
        this.loadingService.closeSpinner();
      } else {
        this.loadingService.closeSpinner();
        this.modalService.showModal('errorService');
      }
    });
  }
}
