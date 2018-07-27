import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { ListComponent } from '../../list/list.component';
/**
 * @export
 * @class ToolbarComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit  {

    public tittleBar: String = 'Ofertas';
    public subtitleBar: String = 'Listado de ofertas';

    @Input() fixed;
    @Input() sidenav;
    @Input() inDetail: boolean;

    constructor(
        public list: ListComponent
    ) {
    }

    ngOnInit() {
    }

    /**
     * @memberof ToolbarComponent
     */
    toggleMenu() {
        this.sidenav.toggle();
    }

    goBack() {
        this.list.viewDetailOffer = false;
        this.list.inDetail = false;
    }

}
