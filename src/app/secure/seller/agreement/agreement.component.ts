import { Component, OnInit } from '@angular/core';
import { EventEmitterSeller } from '@app/shared/events/eventEmitter-seller.service';

@Component({
    selector: 'app-agreement',
    styleUrls: ['agreement.component.scss'],
    templateUrl: 'agreement.component.html'
})

export class AgreementComponent implements OnInit{

    constructor(private emitterSeller: EventEmitterSeller) {}

    ngOnInit() {
        this.emitterSeller.eventSearchSeller.subscribe(data => {
            console.log(data);
        });
    }

}
