import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';

@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

    public tittleBar: String = 'Ofertas';
    public subtitleBar: String = 'Listado de ofertas';

    @Input() fixed;
    @Input() sidenav;

    constructor() { }

    ngOnInit() {
    }

    /**
     * @memberof ToolbarComponent
     */
    toggleMenu() {
        this.sidenav.toggle();
    }

}
