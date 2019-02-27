import { Component, OnInit, Input } from '@angular/core';
import { Logger } from '@app/core/util/logger.service';

const log = new Logger('ExpandedProductComponent');

@Component({
    selector: 'app-expanded-product',
    templateUrl: 'expanded-product.component.html',
    styleUrls: ['expanded-product.component.scss'],
})
export class ExpandedProductComponent implements OnInit {

    constructor(
    ) { }
    ngOnInit() {

    }
}
