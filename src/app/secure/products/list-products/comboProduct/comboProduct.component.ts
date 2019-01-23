import {Component, OnInit} from '@angular/core';
import { Logger } from '@app/core/util/logger.service';

const log = new Logger('ComboProductComponent');

/**
 * @title Card with multiple sections
 */
@Component({
  selector: 'app-combo-product',
  templateUrl: 'comboProduct.component.html',
  styleUrls: ['comboProduct.component.scss'],
})
export class ComboProductComponent implements OnInit {
    constructor(
    ) { }
    ngOnInit() {

    }
}
