import { Component, OnInit, Input } from '@angular/core';
import { Logger } from '@app/core/util/logger.service';

const log = new Logger('ExpandedProductComponent');

@Component({
    selector: 'app-expanded-product',
    templateUrl: 'expanded-product.html',
    styleUrls: ['expanded-product.scss'],
})
export class ExpandedProductComponent implements OnInit {
    productsList: any;
    @Input() products: any;

    constructor(
    ) { }
    ngOnInit() {

    }
}
