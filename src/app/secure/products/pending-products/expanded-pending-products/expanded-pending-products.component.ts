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
  // @Input() offerPermission: boolean;
  @Input() editPermission: boolean;

  /* arreglo q contiene las imagenes grandes y pequeñas */
  public images = [];
  public listKeywords = [];

  public applyOffer: any;

  /* variable que contiene la ruta de la imagen grande */
  public imageMax: string;
  imageLength: number;
  public user: UserInformation;
  public showOfer: boolean;


  constructor(
    private router: Router,
    private userParams?: UserParametersService,
  ) { }

  ngOnInit() {
    console.log('editPermission: ', this.editPermission);
    this.createArrayImages();
    // this.applyOffert();
    this.getDataUser();
    const startswithModel = !!this.productsPendindgExpanded.model && (this.productsPendindgExpanded.model.toString() as string).toLowerCase().startsWith('modelo');
        this.productsPendindgExpanded.model = startswithModel ? (this.productsPendindgExpanded.model.toString() as string).slice(6, this.productsPendindgExpanded.model.length) : this.productsPendindgExpanded.model;
  }

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

  // applyOffert(): void {
  //   this.applyOffer = this.productsPendindgExpanded;
  // }
  editProduct(productsPendindgExpanded: any) {
    this.router.navigate(['securehome/products/creacion-unitaria', { ean: productsPendindgExpanded.ean, reference: productsPendindgExpanded.reference }]);
  }

}
