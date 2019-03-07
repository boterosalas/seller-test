import { Component, OnInit, Input } from '@angular/core';
import { Logger } from '@app/core/util/logger.service';
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
 // productsList: any;
  @Input() productsList: any;


  public productsExpanded: any;
  public showImage = false;



  constructor(
    private productsService?: ListProductService,

  ) { }
  ngOnInit() {

  }



  public openInformation(params?: any): void {
    this.showImage = true;
    console.log('parametro', params);
    this.productsService.getListProductsExpanded(params).subscribe((result: any) => {
        this.productsExpanded = result.data.list;
        console.log('info: ', this.productsExpanded);
    });
}
}
