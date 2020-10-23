import { Component, OnInit, Input } from '@angular/core';
import { UserInformation } from '@app/shared';
import { Router } from '@angular/router';
import { UserParametersService, Logger } from '@app/core';

const log = new Logger('ExpandedPendingProductsComponent');


@Component({
  selector: 'app-expanded-pending-products',
  templateUrl: './expanded-pending-products.component.html',
  styleUrls: ['./expanded-pending-products.component.scss']
})
export class ExpandedPendingProductsComponent implements OnInit {

  @Input() public productsPendindgExpanded: any;
  @Input() public productsPendindgValidationExpanded: any;
  @Input() editPermission: boolean;

  /* arreglo q contiene las imagenes grandes y pequeñas */
  public images = [];
  public listKeywords = [];

  /* variable que contiene la ruta de la imagen grande */
  public imageMax: string;
  imageLength: number;
  public user: UserInformation;
  public showOfer: boolean;
  avaibleProductPending: Boolean = false;

  constructor(
    private router: Router,
    private userParams?: UserParametersService,
  ) {
    if (this.productsPendindgExpanded) {
      this.productsPendindgExpanded = this.productsPendindgExpanded;
    }
    if (this.productsPendindgValidationExpanded) {
      this.productsPendindgExpanded = this.productsPendindgValidationExpanded;
    }
  }

  ngOnInit() {
    if (this.productsPendindgExpanded) {
      const startswithModel = !!this.productsPendindgExpanded.model && (this.productsPendindgExpanded.model.toString() as string).toLowerCase().startsWith('modelo');
      this.productsPendindgExpanded.model = startswithModel ? (this.productsPendindgExpanded.model.toString() as string).slice(6, this.productsPendindgExpanded.model.length) : this.productsPendindgExpanded.model;
    }
    if (this.productsPendindgValidationExpanded) {
      this.productsPendindgExpanded = this.productsPendindgValidationExpanded;
      const startswithModel = !!this.productsPendindgValidationExpanded.model && (this.productsPendindgValidationExpanded.model.toString() as string).toLowerCase().startsWith('modelo');
      this.productsPendindgValidationExpanded.model = startswithModel ? (this.productsPendindgValidationExpanded.model.toString() as string).slice(6, this.productsPendindgValidationExpanded.model.length) : this.productsPendindgValidationExpanded.model;
    }
    this.createArrayImages();
    this.getDataUser();
  }


  /**
   * Obtenerinfo del usuario
   * @memberof ExpandedPendingProductsComponent
   */
  async getDataUser() {
    this.user = await this.userParams.getUserData();
    if (this.user.sellerProfile === 'seller') {
      this.showOfer = false;
    }
  }

  /* funcion que cambia el valor de la variable que contiene la url de la imagen grande y recibe como parametro la url de la imagen grande */
  changeImage(image: any) {
    this.imageMax = image;
  }

  public createArrayImages(): void {
    if (this.productsPendindgExpanded) {
      const minImages: any[] = this.productsPendindgExpanded.smallImage;
      const maxImages: any[] = this.productsPendindgExpanded.mediumImage;
      let i = 0;
      for (i; i < this.productsPendindgExpanded.mediumImage.length; i++) {
        const min = minImages[i];
        const max = maxImages[i];
        this.images.push({ min, max });
      }
      this.imageMax = this.images[0] && this.images[0]['max'];
      this.imageLength = this.images.length;
    }
  }


  /**
   * Metodo para editar productos en creación unitaria
   * @param {*} productsPendindgExpanded
   * @memberof ExpandedPendingProductsComponent
   */
  editProduct(productsPendindgExpanded: any) {
    this.avaibleProductPending = true;
    this.router.navigate(['securehome/products/creacion-unitaria', { ean: productsPendindgExpanded.ean, reference: productsPendindgExpanded.reference, pendingProduct: this.avaibleProductPending }]);
  }

}
