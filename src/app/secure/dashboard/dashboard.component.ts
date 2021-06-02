// 3rd party components
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
// Our own custom components
import { UserLoginService, UserParametersService, LoadingService, ModalService } from '@app/core';
import { Logger } from '@core/util/logger.service';
import { DashboardService } from './services/dashboard.service';
import { RoutesConst } from '@app/shared';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { ModalDashboardComponent } from './modal-dashboard/modal-dashboard.component';
import { MatDialog } from '@angular/material';


/**
 * @export
 * @class DashboardComponent
 */
@Component({
    selector: 'app-dashboard-component',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {


    // Variable para almacenar los datos del vendedor.
    public user: any;

    // Instancia de Logger
    public log: Logger;

    // Variable para ocultar temporalmente indicadores para vendedores
    hideIndicators = false;

    /**
     * @method constructor
     * @description crea una instancia del componente.
     * @param {UserLoginService} [userService]
     * @param {UserParametersService} [userParams]
     * @memberof DashboardComponent
     */
    constructor(
        private _dashboard: DashboardService,
        private languageService: TranslateService,
        public dialog: MatDialog,
        public datepipe: DatePipe,
        public userService?: UserLoginService,
        public userParams?: UserParametersService,
        public router?: Router,
    ) {
    }

    /**
     * @method ngOnInit
     * @description Método que inicializa los datos.
     * @memberof DashboardComponent
     */
    ngOnInit(): void {
        this.log = new Logger('DashboardComponent');
        this.getUserData();
    }

    /**
     * @method getUserData
     * @description Método que carga los datos del vendedor para obtener la sellerId.
     * @memberof DashboardComponent
     */
    private async getUserData() {
        this.user = await this.userParams.getUserData();
        if (this.user && this.user.sellerProfile !== 'seller') {
            this.hideIndicators = true;
        } else {
            this.hideIndicators = false;
        }
    }
}