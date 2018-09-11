import { Component, Input } from '@angular/core';
import { Logger } from '@core/util/logger.service';

const log = new Logger('MFAComponent');

@Component({
    selector: 'app-awscognito-mfa',
    templateUrl: './mfa.html'
})
export class MFAComponent {
    @Input() destination: string;
    @Input() onSubmit: (code: string) => void;

    constructor() {
        log.debug('MFAComponent constructor');
    }
}
