import { Component, OnInit } from '@angular/core';
import { EventEmitterSeller } from '@app/shared/events/eventEmitter-seller.service';
import { AgreementService, Agreement } from './agreement.component.service';
import { Logger } from '@core/util/logger.service';
import { BillingOrdersService } from '@app/secure/orders/billing-orders/billing-orders.service';
import { LoadingService } from '@app/core';

const log = new Logger('AgreementComponent');


@Component({
    selector: 'app-agreement',
    styleUrls: ['agreement.component.scss'],
    templateUrl: 'agreement.component.html'
})

export class AgreementComponent implements OnInit {

    sellerData: any;
    agreementsSeller: Agreement[] = [];
    constructor(private emitterSeller: EventEmitterSeller,
        private agreementService: AgreementService,
        private billingOrdersService: BillingOrdersService,
        private loadingService: LoadingService) { }

    ngOnInit() {
        this.emitterSeller.eventSearchSeller.subscribe(data => {
            this.sellerData = data;
            this.agreementsSeller = [];
            this.chargeAgreements();
        });
    }

    public chargeAgreements(): void {
        this.loadingService.viewSpinner();
        this.agreementService.getAgreements(this.sellerData.IdSeller).subscribe(data => {
            if (data && data.body) {
                try {
                    const terms = JSON.parse(data.body);
                    this.agreementsSeller = terms.Data as Agreement[];
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
