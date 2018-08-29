import { HttpHeaders } from '@angular/common/http';
export class FinishUploadInformation {
    constructor(
        public body: Body,
        public headers: HttpHeaders,
        public ok: boolean,
        public status: number,
        public statusText: string,
        public type: number,
        public url: string
    ) { }
}

/**
 * DetailFinishUploadInformation
 * @export
 * @class DetailFinishUploadInformation
 */
export class Body {
    constructor(
        public totalProcess: number,
        public error: number,
        public successful: number,
        public offerNotifyViewModels: OfferNotifyViewModels
    ) { }
}

export class OfferNotifyViewModels {
    constructor(
        public ean: any,
        public message: string
    ) { }
}
