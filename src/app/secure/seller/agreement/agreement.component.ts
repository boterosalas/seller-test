import { Component, OnInit } from '@angular/core';
import { EventEmitterSeller } from '@app/shared/events/eventEmitter-seller.service';
import { AgreementService, Agreement } from './agreement.component.service';
import { Logger } from '@core/util/logger.service';

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
                private agreementService: AgreementService) {}

    ngOnInit() {
        this.emitterSeller.eventSearchSeller.subscribe(data => {
            this.sellerData = data;
            this.agreementsSeller = [];
            this.chargeAgreements();
        });
    }

    public chargeAgreements(): void {
        this.agreementService.getAgreements(this.sellerData.IdSeller).subscribe(data => {
            if (data) {
                this.agreementsSeller = data as Agreement[];
            }
        }, error => {
            log.error('Error al obtener los acuerdos:', error);
        });
    }

    public getPDF(model: any): void {
        this.agreementService.getPDF().subscribe(data => {
            console.log(data);
        }, error => {
            log.error('Error al obtener los acuerdos:', error);
        });
    }

}
