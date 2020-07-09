import { Component, OnInit, Input } from '@angular/core';
import { Logger, LoadingService } from '@app/core';
import { ListProductService } from '../../list-products/list-products.service';
import { MatSnackBar } from '@angular/material';
import { PendingProductsService } from '../pending-products.service';

const log = new Logger('ComboProductComponent');


@Component({
  selector: 'app-combo-pending-product',
  templateUrl: './combo-pending-product.component.html',
  styleUrls: ['./combo-pending-product.component.scss']
})
export class ComboPendingProductComponent implements OnInit {

  @Input() productsList: any;
  @Input() showProducts: boolean;
  @Input() offerPermission: boolean;
  @Input() editPermission: boolean;

  public productsExpanded: any;
  public showImage = false;

  constructor(
    private pendingProductsService?: PendingProductsService,
    private loadingService?: LoadingService,
    public snackBar?: MatSnackBar,
  ) { }

  ngOnInit() {
    this.pendingProductsService.change.subscribe(data => {
      if (!data) {
        this.backTolist();
      }
    });
  }

  public backTolist(): void {
    this.productsExpanded = null;
    this.showImage = false;
  }

  // public openInformation(params?: any): void {
  //   this.loadingService.viewSpinner();
  //   this.productsService.getListProductsExpanded(params).subscribe((result: any) => {
  //     this.loadingService.closeSpinner();
  //     this.showImage = true;
  //     this.productsExpanded = result.data.list;
  //   });
  // }

}
