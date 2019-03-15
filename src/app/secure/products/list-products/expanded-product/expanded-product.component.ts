import { Component, OnInit, Input } from '@angular/core';
import { Logger } from '@app/core/util/logger.service';

const log = new Logger('ExpandedProductComponent');

@Component({
    selector: 'app-expanded-product',
    templateUrl: 'expanded-product.component.html',
    styleUrls: ['expanded-product.component.scss'],
})
export class ExpandedProductComponent implements OnInit {

    @Input() productsExpanded: any;

    /* arreglo q contiene las imagenes grandes y pequeñas */
    public images = [];
    public listKeywords = [];

    public applyOffer: any;

    /* variable que contiene la ruta de la imagen grande */
    public imageMax: string;
    imageLength: number;
    constructor(
    ) {
        /* creo el arreglo con las variables en JSon */

        /* asigno la 1 imagen grande del arreglo */
    }


    ngOnInit() {
        this.createArrayImages();
        this.applyOffert();
    }

    /* funcion que cambia el valor de la variable que contiene la url de la imagen grande y recibe como parametro la url de la imagen grande */
    changeImage(image: any) {
        this.imageMax = image;
    }

    public createArrayImages(): void {
        const minImages: any[] = this.productsExpanded.smallImage;
        const maxImages: any[] = this.productsExpanded.mediumImage;
        let i = 0;
        for (i; i < this.productsExpanded.mediumImage.length; i++) {
            const min = minImages[i];
            const max = maxImages[i];
            this.images.push({ min, max });
        }
        this.imageMax = this.images[0] && this.images[0]['max'];
        this.imageLength = this.images.length;
    }

    applyOffert(): void {
        this.applyOffer = this.productsExpanded;
    }
}
