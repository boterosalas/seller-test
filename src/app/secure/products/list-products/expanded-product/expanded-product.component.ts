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
    private images: any;

    /* variable que contiene la ruta de la imagen grande */
    public imageMax: string;

    constructor(
    ) {
        /* creo el arreglo con las variables en JSon */
        this.images = [
            {
                min: 'https://s3.amazonaws.com/seller.center.exito.images/imagesDev/products/845/PMK0000006095845/MK00000006095845_xs_a.jpg',
                max: 'https://s3.amazonaws.com/seller.center.exito.images/imagesDev/products/845/PMK0000006095845/MK00000006095845_lrg_a.jpg'
            },
            {
                min: 'https://s3.amazonaws.com/seller.center.exito.images/imagesDev/products/845/PMK0000006095845/MK00000006095845_sm_c.jpg',
                max: 'https://s3.amazonaws.com/seller.center.exito.images/imagesDev/products/845/PMK0000006095845/MK00000006095845_lrg_c.jpg'
            }
        ];

        /* asigno la 1 imagen grande del arreglo */
        this.imageMax = this.images[0]['max'];
    }


    ngOnInit() {

    }

    /* funcion que cambia el valor de la variable que contiene la url de la imagen grande y recibe como parametro la url de la imagen grande */
    changeImage(imageUrlMax: string) {
        this.imageMax = imageUrlMax;
    }
}
