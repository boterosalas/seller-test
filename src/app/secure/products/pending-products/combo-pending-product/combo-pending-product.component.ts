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

  @Input() public productsList: any;
  @Input() showProducts: boolean;
  @Input() offerPermission: boolean;
  @Input() editPermission: boolean;

  public productsPendindgExpanded: any;
  public showImage = false;

  public infoProduct: any;

  public user: UserInformation;


  constructor(
    private pendingProductsService?: PendingProductsService,
    private loadingService?: LoadingService,
    public snackBar?: MatSnackBar,
    public userParams?: UserParametersService,
  ) {
    console.log(1, this.infoProduct, this.productsList);
    this.getDataUser();
    this.infoProduct = this.productsList;
  }

  ngOnInit() {
    this.pendingProductsService.change.subscribe(data => {
      if (!data) {
        this.backTolist();
      }
    });
  }

  async getDataUser() {
    this.user = await this.userParams.getUserData();
  }

  public backTolist(): void {
    this.productsPendindgExpanded = null;
    this.showImage = false;
  }

  public openInformation(params?: any): void {
    this.loadingService.viewSpinner();
    this.pendingProductsService.getEANProductsModify(params).subscribe((result: any) => {
      console.log('res combo: ', result);
      this.showImage = true;
      this.productsPendindgExpanded = result.data;
      this.loadingService.closeSpinner();
    });
  }

  setparams(params: any) {
    const paramsArray = {
      idSeller: 11811,
      ean: 1001114217562,
    };
    const sellerId = 11811;
    const eanParam = 1001114217562;
    console.log(params);

    console.log(params.parentReference);
    if (!params.parentReference || params.parentReference === '') {
      params.parentReference = null;
    }

    const paramsServv = `${sellerId}/${params.ean}`;

    this.openInformation(paramsServv);
  }

}
