import { Component, OnInit } from '@angular/core';
import { EventEmitterSeller } from '@app/shared/events/eventEmitter-seller.service';
import { AgreementService, Agreement } from './agreement.component.service';
import { Logger } from '@core/util/logger.service';
import { BillingOrdersService } from '@app/secure/orders/billing-orders/billing-orders.service';
import { LoadingService, UserParametersService } from '@app/core';
import { AuthService } from '@app/secure/auth/auth.routing';
import { MenuModel, downloadFunctionality, agreementName, visualizeFunctionality, readFunctionality, agreementNameSeller } from '@app/secure/auth/auth.consts';
import { ConfigurationServicePlaceholders } from 'aws-sdk/lib/config_service_placeholders';
import { TranslateService } from '@ngx-translate/core';

const log = new Logger('AgreementComponent');


@Component({
    selector: 'app-agreement',
    styleUrls: ['agreement.component.scss'],
    templateUrl: 'agreement.component.html'
})

export class AgreementComponent implements OnInit {

    sellerData: any;
    agreementsSeller: Agreement[] = [];
    // Variables con los permisos que este componente posee
    permissionComponent: MenuModel;
    visualize = visualizeFunctionality;
    download = downloadFunctionality;
    read = readFunctionality;

    // user info
    public user: any;
    // Nombre del menu dependiendo si es admin o seller
    nameModule: any;
    title: any;
    activeToolbarSearch: Boolean = false;

    constructor(private emitterSeller: EventEmitterSeller,
        private agreementService: AgreementService,
        private billingOrdersService: BillingOrdersService,
        private loadingService: LoadingService,
        public authService: AuthService,
        private userParams: UserParametersService,
        private languageService: TranslateService
    ) {
        this.getDataUser();
    }

    ngOnInit() {
        this.permissionComponent = this.authService.getMenu(this.nameModule);
        this.emitterSeller.eventSearchSeller.subscribe(data => {
            this.sellerData = data;
            this.agreementsSeller = [];
            this.chargeAgreements(this.sellerData.IdSeller);
        });
    }


    async getDataUser() {
        this.user = await this.userParams.getUserData();
        if (this.user && this.user.sellerProfile === 'seller') {
            this.nameModule = agreementNameSeller;
            this.chargeAgreements('null');
            this.title = 'Acuerdos y/o anexos';
            this.activeToolbarSearch = false;

        } else {
            this.nameModule = agreementName;
            this.title = this.languageService.instant('secure.seller.contracts.lb_title_toolbar');
            this.activeToolbarSearch = true;
        }
    }

    /**
     * Funcion que verifica si la funcion del modulo posee permisos
     *
     * @param {string} functionality
     * @returns {boolean}
     * @memberof ToolbarComponent
     */
    public getFunctionality(functionality: string): boolean {
        const permission = this.permissionComponent.Functionalities.find(result => functionality === result.NameFunctionality);
        return permission && permission.ShowFunctionality;
    }

    /**
     * Cargar acuerdos.
     *
     * @memberof AgreementComponent
     */
    public chargeAgreements(paramSeller: any): void {
        this.loadingService.viewSpinner();
        this.agreementService.getAgreements(paramSeller).subscribe(data => {
            if (data && data.body) {
                try {
                    const terms = JSON.parse(data.body);
                    this.agreementsSeller = terms.Data as Agreement[];
                    console.log(88, this.agreementsSeller);
                    this.loadingService.closeSpinner();
                } catch (e) {
                    console.error('Error al cargar los acuerdos', e);
                }
            }
        }, error => {
            log.error('Error al obtener los acuerdos:', error);
        });
    }

    /** funcion para abrir nueva ventana con la url del documento pdf de terminos */
    public getPDF(model: any): void {
        window.open(model.ContractcUrl, '_blank');
    }

    public getPDF2(model: any): void {
        this.loadingService.viewSpinner();
        this.billingOrdersService.getDownnLoadBilling(['model.ContractcUrl']).subscribe(result => {
            this.showFile(result, (model.ContractName), 'application/pdf');
            this.loadingService.closeSpinner();
        }, error => {
            log.error('Error al obtener los acuerdos:', error);
        });
    }

    /**
     * Funcion  showFile(blob: any, filename: string) que convierte el texto plano en archivo pdf
     *
     * @param {*} blob
     * @param {string} filename
     * @returns
     * @memberof BillingOrderComponent
     */
    public showFile(blob: any, filename: string, type: string) {
        // It is necessary to create a new blob object with mime-type
        // explicitly set otherwise only Chrome works like it should
        const newBlob = new Blob([blob], { type: type });

        // IE doesn't allow using a blob object directly as link href
        // instead it is necessary to use msSaveOrOpenBlob
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(newBlob);
            return;
        }

        // For other browsers
        // Create a link pointing to the ObjectURL containing the blob.
        const data = window.URL.createObjectURL(newBlob);
        const link = document.createElement('a');
        link.href = data;
        link.download = filename;
        link.click();
        setTimeout(() => {
            // For Firefox it is necessary to delay revoking the ObjectURL
            window.URL.revokeObjectURL(data);
        }, 100);
    }

}
