import { Component, OnInit } from '@angular/core';
import { BillingOrdersService } from './billing-orders.service';
import { Logger } from '@core/util/logger.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingService } from '@app/core';
import { ComponentsService } from '@app/shared';
import { AuthService } from '@app/secure/auth/auth.routing';
import { onlineBillName, MenuModel, readFunctionality, downloadFunctionality } from '@app/secure/auth/auth.consts';
import { TranslateService } from '@ngx-translate/core';

const log = new Logger('BillingOrderComponent');

@Component({
    selector: 'app-billing-orders',
    styleUrls: ['billing-orders.component.scss'],
    templateUrl: 'billing-orders.component.html'
})

export class BillingOrderComponent implements OnInit {
    sellerData: any;
    billingGroup: FormGroup;
    billingOrders: any[];
    keysBilling: any = [];
    xhr = new XMLHttpRequest();
    keys: any;

    // Variables con los permisos que este componente posee
    permissionComponent: MenuModel;
    read = readFunctionality;
    download = downloadFunctionality;

    constructor(
        private billingOrdersService: BillingOrdersService,
        private fb: FormBuilder,
        private loadingService: LoadingService,
        public componentsService: ComponentsService,
        public authService: AuthService,
        private languageService: TranslateService
    ) { }
    ngOnInit() {
        this.permissionComponent = this.authService.getMenu(onlineBillName);
        this.billingGroup = this.fb.group({
            billingOrderCtrl: [{ value: '', disabled: !this.getFunctionality(this.read) }, Validators.required],
        });
        this.billingOrders = [];
    }

    /**
     * Funcion que verifica si la funcion del modulo posee permisos
     *
     * @param {string} functionality
     * @returns {boolean}
     * @memberof BillingOrderComponent
     */
    public getFunctionality(functionality: string): boolean {
        const permission = this.permissionComponent.Functionalities.find(result => functionality === result.NameFunctionality);
        return permission && permission.ShowFunctionality;
    }

    /**
     * Funcion chargeBillingOrders() que se utiliza para cargar todas las ordenes con sus facturas
     *
     * @memberof BillingOrderComponent
     */
    public chargeBillingOrders(): void {
        if (this.billingGroup.controls.billingOrderCtrl.value === undefined || this.billingGroup.controls.billingOrderCtrl.value === null ||  this.billingGroup.controls.billingOrderCtrl.value === '') {
            const message = this.languageService.instant('secure.orders.billing_orders.must_enter_order');
            this.componentsService.openSnackBar(message, this.languageService.instant('actions.close'), 4000);
        }else {
        this.loadingService.viewSpinner();
        this.billingOrdersService.getBillingOrders(this.billingGroup.controls.billingOrderCtrl.value).subscribe(result => {
            this.sellerData = result.data;
            if (result.data) {
                this.keysBilling = result.data;
            }
            this.loadingService.closeSpinner();
        });
    }
    }

    /**
     * Funcion viewPDF(billing: any) que utilizamos para visualizar el pdf en el navegador.
     *
     * @param {*} billing
     * @memberof BillingOrderComponent
     */
    public viewPDF(billing: any): void {
        if(billing && billing.billUrl !== undefined){
            if(billing.fileType === 1) {
                window.open(billing.billUrl, '_blank', 'fullscreen=yes, screenTop');
            } else if (billing.fileType === 2) {
                window.open(billing.billUrl, 'ZIP');
            }
        }
    }

    /**
     * Funcion downloadPDF(billing: any) para descargar las facturas formato pdf
     *
     * @param {*} billing
     * @memberof BillingOrderComponent
     */
    public downloadPDF(billing: any): void {
        this.loadingService.viewSpinner();
        this.billingOrdersService.getDownnLoadBilling([billing.billUrl]).subscribe(result => {
            const data = result;
            this.showFile(result, (billing.sellerName), 'application/pdf');
            this.loadingService.closeSpinner();
        });
    }


    /**
     * Funcion  downloadAllPDF() apra descargar todos las facturas en formato pdf
     *
     * @param {*} filename
     * @memberof BillingOrderComponent
     */
    public downloadAllPDF() {
        this.keysBilling.forEach(element => {
            this.downloadPDF(element);
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
