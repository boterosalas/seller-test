import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserInformation } from '@app/shared';
import { Router } from '@angular/router';
import { UserParametersService, Logger } from '@app/core';
import { MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { ModalGenericProductMultiOfertComponent } from './component/modal-generic-product-multi-ofert/modal-generic-product-multi-ofert.component';

const log = new Logger('ExpandedPendingProductsComponent');


@Component({
  selector: 'app-expanded-pending-products',
  templateUrl: './expanded-pending-products.component.html',
  styleUrls: ['./expanded-pending-products.component.scss']
})
export class ExpandedPendingProductsComponent implements OnInit {

  @Input() public productsPendindgExpanded: any;
  @Input() public productsPendindgValidationExpanded: any;
  @Input() public productsMultiOfertExpanded: any;
  @Input() public typeDetailProduct = 'genericProduct';
  @Input() editPermission: boolean;

  /* arreglo q contiene las imagenes grandes y pequeñas */
  public images = [];
  public listKeywords = [];
  public arrayKeyWords = [];
  public arrayMultiOfert = [];
  public arrayDescription = [];
  public arrayVideo = [];
  public arrayFeature = [];
  public arrayImages1 = [];
  public arrayImages2 = [];
  public arrayImages3 = [];
  public arrayImages4 = [];
  public arrayImages5 = [];
  @Output() isBackList = new EventEmitter<object>();

  /* variable que contiene la ruta de la imagen grande */
  public imageMax: string;
  imageLength: number;
  public user: UserInformation;
  public showOfer: boolean;
  avaibleProductPending: Boolean = false;

  public showImage = true;
  public showVideo = false;
  public currentProduct = [];
  public oldProduct = [];

  constructor(
    private languageService: TranslateService,
    private router: Router,
    private dialog: MatDialog,
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

    if (this.productsMultiOfertExpanded) {
      this.currentProduct = JSON.parse(this.productsMultiOfertExpanded.currentProduct);
      this.oldProduct = JSON.parse(this.productsMultiOfertExpanded.oldProduct);
      console.log('curr: ', this.currentProduct);
      console.log('old: ', this.oldProduct);

      for (const product in  this.oldProduct) {
        if ( this.oldProduct.hasOwnProperty(product) && this.currentProduct.hasOwnProperty(product)) {
          this.arrayMultiOfert.push(
            {
              name: product,
              old:  this.oldProduct[product],
              current: this.currentProduct[product],
              expandable: this.validateExpandable(product)
            }
          );
        }
      }
    }

    this.createArrayImages();
    this.getDataUser();
  }
  validateExpandable(name: string) {
    let expansible = false;
    console.log('name: ', name);
    switch (name) {
      case 'Features':
        console.log('here features');
        expansible = true;
        const currentProductFeature = JSON.parse(this.productsMultiOfertExpanded.currentProduct).Features;
        const oldProductFeature = JSON.parse(this.productsMultiOfertExpanded.oldProduct).Features;
        for (const productFeature in oldProductFeature) {
          if (oldProductFeature.hasOwnProperty(productFeature) && currentProductFeature.hasOwnProperty(productFeature)) {
            this.arrayFeature.push(
              {
                key: oldProductFeature[productFeature].Key,
                valueOld: oldProductFeature[productFeature].Value,
                valueCurrent: currentProductFeature[productFeature].Value,
              }
            );
          }
        }
        break;
      case 'KeyWords':
        console.log('here KeyWords');
        expansible = true;
        this.arrayKeyWords = [];
        const currentProductKeywords = JSON.parse(this.productsMultiOfertExpanded.currentProduct).KeyWords;
        const oldProductKeywords = JSON.parse(this.productsMultiOfertExpanded.oldProduct).KeyWords;
        if (currentProductKeywords !== '' && oldProductKeywords !== '') {
          this.arrayKeyWords.push({
            valueOld: oldProductKeywords,
            valueCurrent: currentProductKeywords,
          });
        }
        break;
      case 'Description':
        console.log('here Description');
        expansible = true;
        this.arrayDescription = [];
        const currentProductDescription = JSON.parse(this.productsMultiOfertExpanded.currentProduct).Description;
        const oldProductDescription = JSON.parse(this.productsMultiOfertExpanded.oldProduct).Description;
        console.log(44, currentProductDescription);
        console.log(55, oldProductDescription);

        this.arrayDescription.push({
          valueOld: oldProductDescription,
          valueCurrent: currentProductDescription,
        });
        break;
      case 'VideoUrl':
        expansible = true;
        this.arrayVideo = [];
        const currentProductVideo = JSON.parse(this.productsMultiOfertExpanded.currentProduct).VideoUrl;
        const oldProductVideo = JSON.parse(this.productsMultiOfertExpanded.oldProduct).VideoUrl;
        this.arrayVideo.push({
          valueOld: oldProductVideo,
          valueCurrent: currentProductVideo,
        });
        console.log(99, currentProductVideo)
        break;
      case 'ImageUrl1':
        this.arrayImages1.push(
          {
            imagenCurrent: JSON.parse(this.productsMultiOfertExpanded.currentProduct).ImageUrl1,
            imagenOld: JSON.parse(this.productsMultiOfertExpanded.oldProduct).ImageUrl1
          }
        );
        expansible = true;
        break;
      case 'ImageUrl2':
        this.arrayImages2.push(
          {
            imagenCurrent: JSON.parse(this.productsMultiOfertExpanded.currentProduct).ImageUrl2,
            imagenOld: JSON.parse(this.productsMultiOfertExpanded.oldProduct).ImageUrl2
          }
        );
        expansible = true;
        break;
      case 'ImageUrl3':
        this.arrayImages3.push(
          {
            imagenCurrent: JSON.parse(this.productsMultiOfertExpanded.currentProduct).ImageUrl3,
            imagenOld: JSON.parse(this.productsMultiOfertExpanded.oldProduct).ImageUrl3
          }
        );
        expansible = true;
        break;
      case 'ImageUrl4':
        this.arrayImages4.push(
          {
            imagenCurrent: JSON.parse(this.productsMultiOfertExpanded.currentProduct).ImageUrl4,
            imagenOld: JSON.parse(this.productsMultiOfertExpanded.oldProduct).ImageUrl4
          }
        );
        expansible = true;
        break;
      case 'ImageUrl5':
        this.arrayImages5.push(
          {
            imagenCurrent: JSON.parse(this.productsMultiOfertExpanded.currentProduct).ImageUrl5,
            imagenOld: JSON.parse(this.productsMultiOfertExpanded.oldProduct).ImageUrl5
          }
        );
        expansible = true;
        break;
      default:
        expansible = false;
        break;
    }
    return expansible;
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
  changeImage(image: any, img: any) {
    this.imageMax = image;
    const { min } = img;
    const splitYoutube = min.split('https://img.youtube.com');
    if (splitYoutube[0] === '') {
      this.showVideo = true;
      this.showImage = false;
    } else {
      this.showVideo = false;
      this.showImage = true;
    }

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


  modalGeneric(type: string) {
    let params = {};
    if (type === 'approved') {
      params = {
        title: this.languageService.instant('secure.products.create_product_unit.list_products.expanded_product.multiOfert.modal_title_approved'),
        subtitle: this.languageService.instant('secure.products.create_product_unit.list_products.expanded_product.multiOfert.modal_subtitle_approved'),
        type: type
      };
    } else if (type === 'reject') {
      params = {
        title: this.languageService.instant('secure.products.create_product_unit.list_products.expanded_product.multiOfert.modal_title_reject'),
        subtitle: this.languageService.instant('secure.products.create_product_unit.list_products.expanded_product.multiOfert.modal_subtitle_reject'),
        type: type
      };
    }

    const dialogRef = this.dialog.open(ModalGenericProductMultiOfertComponent, {
      width: '50%',
      data: params,
    });

    const dialogIntance = dialogRef.componentInstance;
    dialogIntance.processFinish$.subscribe((val) => {
      this.isBackList.emit({ back: true });
    });
  }

}
