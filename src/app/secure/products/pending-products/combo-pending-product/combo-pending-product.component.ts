import { Component, OnInit, Input } from '@angular/core';
import { Logger, LoadingService, UserParametersService } from '@app/core';
import { ListProductService } from '../../list-products/list-products.service';
import { MatSnackBar } from '@angular/material';
import { PendingProductsService } from '../pending-products.service';
import { UserInformation } from '@app/shared';

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

  public infoProduct: any;

  public user: UserInformation;

  constructor(
    private pendingProductsService?: PendingProductsService,
    private loadingService?: LoadingService,
    public snackBar?: MatSnackBar,
    public userParams?: UserParametersService,
  ) {
    this.getDataUser();
    this.infoProduct = this.productsList;
  }

  ngOnInit() {
    this.pendingProductsService.change.subscribe(data => {
      if (!data) {
        this.backTolist();
      }
    });
    console.log(this.infoProduct, this.productsList);
  }

  async getDataUser() {
    this.user = await this.userParams.getUserData();
  }

  public backTolist(): void {
    this.productsExpanded = null;
    this.showImage = false;
  }

  public openInformation(params?: any): void {
    console.log('params: ', params);

    this.loadingService.viewSpinner();
    this.pendingProductsService.getEANProductsModify(params).subscribe((result: any) => {
      this.loadingService.closeSpinner();
      this.showImage = true;
      this.productsExpanded = result.data.list;
    });
  }

  setparams() {
    const paramsArray = {
      'ean': 1001114217562,
      'idSeller': 11811,
      'reference': null
    };

    this.openInformation(paramsArray);
  }

}
