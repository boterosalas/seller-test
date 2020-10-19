import { Component, OnInit, Input } from '@angular/core';
import { Logger, LoadingService, UserParametersService } from '@app/core';
import { ListProductService } from '../../list-products/list-products.service';
import { MatSnackBar } from '@angular/material';
import { PendingProductsService } from '../pending-products.service';
import { UserInformation } from '@app/shared';
import { TranslateService } from '@ngx-translate/core';

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
  @Input() sellerId: any;
  @Input() indexTab: any;

  public productsPendindgExpanded: any;
  public productsPendindgValidationExpanded: any;

  public showImage = false;

  public infoProduct: any;

  public user: UserInformation;

  public showProductValidation = false;
  public showProductModify = false;
  matTabIndex: number;
  tooltipDetail: string;


  constructor(
    private pendingProductsService: PendingProductsService,
    private loadingService?: LoadingService,
    public snackBar?: MatSnackBar,
    public userParams?: UserParametersService,
    private languageService?: TranslateService,
  ) {
    this.getDataUser();
    this.infoProduct = this.productsList;
    this.matTabIndex = this.indexTab;
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

  /**
   * Metodo para volver al listado de productos
   * @memberof ComboPendingProductComponent
   */
  public backTolist(): void {
    this.productsPendindgExpanded = null;
    this.productsPendindgValidationExpanded = null;
    this.showImage = false;
  }

  /**
   * Información detalle productos rechazados pendiente modificación
   * @param {*} [params]
   * @memberof ComboPendingProductComponent
   */
  public openInformation(params?: any): void {
    this.loadingService.viewSpinner();
    this.pendingProductsService.getEANProductsModify(params).subscribe((result: any) => {
      this.showImage = true;
      this.productsPendindgExpanded = result.data;
      this.loadingService.closeSpinner();
    });
  }

  /**
   * Información detalle de productos pendiente de validación
   * @param {*} [params]
   * @memberof ComboPendingProductComponent
   */
  public openInfoProductValidation(params?: any) {
    this.loadingService.viewSpinner();
    this.pendingProductsService.getEANProductsValidation(params).subscribe((result: any) => {
      this.showImage = true;
      this.productsPendindgValidationExpanded = result.data;
      this.loadingService.closeSpinner();
    });
  }


  /**
   * Seteo de parametros y envio data para la carga del servicio para ionformacion expandida productos rechazados para modificación
   * @param {*} params
   * @memberof ComboPendingProductComponent
   */
  setparams(params: any) {
    if (!params.parentReference || params.parentReference === '') {
      params.parentReference = null;
    }
    const paramsServ = `${this.sellerId}/${params.ean}`;
    this.openInformation(paramsServ);
  }

  /**
   * Seteo de parametros y envio data para la carga del servicio para ionformacion expandida productos en validación
   * @param {*} params
   * @memberof ComboPendingProductComponent
   */
  setparams2(params: any) {
    if (!params.parentReference || params.parentReference === '') {
      params.parentReference = null;
    }
    const paramsServ = `${this.sellerId}/${params.ean}`;
    this.openInfoProductValidation(paramsServ);
  }

  /**
   * Función que concatena el motivo y la observación para el tooltip.
   * @param {*} params: Se recibe toda la informacion del producto
   * @returns
   * @memberof ComboPendingProductComponent
   */
  makeTooltipDetail(params: any) {
    let concatInfo = '';
    if (params) {
      concatInfo = `${this.languageService.instant('secure.seller.list.reason')}: ${params.reason}`  +  ' || '  + `${this.languageService.instant('secure.seller.list.observation')}: ${params.comment}`;
    } else {
      concatInfo = null;
    }
    return concatInfo;
  }

}
