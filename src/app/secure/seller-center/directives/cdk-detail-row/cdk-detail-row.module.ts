/* 3rd party components */
import { NgModule } from '@angular/core';

/* our own custom components */
import { CdkDetailRowDirective } from './cdk-detail-row.directive';

@NgModule({
    imports: [
    ],
    declarations: [
        CdkDetailRowDirective,
    ],
    exports: [
        CdkDetailRowDirective,
    ]
})
export class CdkDetailRowDirectiveModule { }
