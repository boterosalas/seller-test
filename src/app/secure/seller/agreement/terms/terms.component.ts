import { Component, OnInit, Inject, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { NavData } from '@app/shared/util/getNavData';
import { HttpClient } from '@angular/common/http';
import { EndpointService, LoadingService } from '@app/core';
import { BillingOrdersService } from '@app/secure/orders/billing-orders/billing-orders.service';
import { Router, NavigationStart } from '@angular/router';
import { RoutesConst } from '@app/shared';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-terms',
    templateUrl: 'terms.component.html',
    styleUrls: ['terms.component.scss']
})

export class TermsComponent implements OnInit, OnDestroy {

    /**
     * Se inicializan variables necesarias para el funcionamiento del componente de mostrar el dialogo de contrato de trabajo.
     * @memberof TermsComponent
     */
    formTerms: FormGroup;
    chargueView = false;

    processFinish$ = new Subject<any>();
    // tslint:disable-next-line:max-line-length
    textTerms: string;
    navData: NavData = new NavData();
    showPage = false;
    msgError = 'No se pudo guardar los términos';

    constructor(
        public dialogRef: MatDialogRef<TermsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private http: HttpClient,
        private api: EndpointService,
        private languageService: TranslateService,
        private billingOrdersService: BillingOrdersService,
        private loadingService: LoadingService,
        private router: Router,
        private snackBar: MatSnackBar) {
        this.textTerms = data.ContractUrl;
    }

    public chargePdf(charge: boolean): boolean {
        return true;
    }

    /**
     * Funcion downloadPDF(billing: any) para descargar las facturas formato pdf
     *
     * @param {*} billing
     * @memberof BillingOrderComponent
     */
    public closeDialog2(): void {
        this.loadingService.viewSpinner();
        this.billingOrdersService.getDownnLoadBilling([this.data.ContractUrl]).subscribe(result => {
            this.showFile(result, this.languageService.instant('secure.seller.contracts.terms_conditions'), 'application/pdf');
            this.loadingService.closeSpinner();
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

    ngOnInit() {
        this.router.events.forEach( (event: NavigationStart) => {
            if (event.url !== '/' + RoutesConst.securehome && !this.showPage) {
                window.location.replace('/' + RoutesConst.securehome);
            }
        });
        this.createTermsForms();
    }

    ngOnDestroy() {
        this.showPage = true;
    }

    /** funcion para abrir nueva ventana con la url del documento pdf de terminos */
    public closeDialog(): void {
        window.open(this.data.ContractUrl, '_blank');
    }

    /**
     * Funcion para inicializar el formulario
     *
     * @memberof TermsComponent
     */
    createTermsForms(): void {
        this.formTerms = new FormGroup({
            responsable: new FormControl('', [
                Validators.required
            ]),
            identification: new FormControl('', [
                Validators.required
            ]),
            accept: new FormControl(false, [
                Validators.requiredTrue
            ])
        });
        this.chargueView = true;
    }

    /**
     * Guardar terminos del vendendor.
     *
     * @memberof TermsComponent
     */
    public saveTerms(responseContract: boolean): void {
        this.loadingService.viewSpinner();
        if (!responseContract) {
            localStorage.setItem('showModalContract', 'false');
        }
            const dataToSend = {
                IdRepresentative: this.formTerms.controls.identification.value,
                Ip: this.navData.getIp(),
                NameRepresentative: this.formTerms.controls.responsable.value,
                idRepresentative: this.formTerms.controls.identification.value,
                ip: this.navData.getIp(),
                nameRepresentative: this.formTerms.controls.responsable.value,
                responseContract: responseContract,
                documentType: this.data && this.data.DocumentType ? this.data.DocumentType : null,
                id: this.data && this.data.Id ? this.data.Id : null,
            };
            if (!dataToSend.Ip) {
                dataToSend.Ip = '';
                dataToSend.ip = '';
            }
            this.http.patch(this.api.get('updateTermsSeller'), dataToSend).subscribe( (data: any) => {
                if (data && ( data.statusCode === 200 || data.statusCode === 201 ) ) {
                    if (responseContract) {
                        this.processFinish$.next({responseContract : true, reload: true });
                        const myDiv = document.getElementById('parrafo');
                        myDiv.scrollTop = 0;
                        this.formTerms.reset();
                    } else {
                        this.processFinish$.next({responseContract : false, reload: false });
                        this.loadingService.closeSpinner();
                        this.dialogRef.close();
                    }
                } else {
                    this.snackBar.open(this.languageService.instant('secure.seller.contracts.not_save_agreement'), this.languageService.instant('actions.close'), {
                      duration: 3000,
                    });
                }
            }, error => {
                this.loadingService.closeSpinner();
            });
    }
}
