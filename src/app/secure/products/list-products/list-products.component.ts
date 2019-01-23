import { Component, OnInit } from '@angular/core';
import { Logger } from '@app/core/util/logger.service';

const log = new Logger('ListProductsComponent');


@Component({
    selector: 'app-list-products',
    styleUrls: ['list-products.component.scss'],
    templateUrl: 'list-products.component.html'
})

export class ListProductsComponent implements OnInit {
    constructor(
    ) { }
    ngOnInit() {

    }
}
