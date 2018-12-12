import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { HttpEvent, HttpRequest, HttpClient } from '@angular/common/http';
import { HttpResponse } from 'aws-sdk/global';

@Component({
    selector: 'app-load-file',
    templateUrl: 'load-file.html',
    styleUrls: ['load-file.scss']
})

export class LoadFileComponent implements OnInit {
    accept = '*';
    files: File[] = [];
    progress: number;
    url = 'https://evening-anchorage-3159.herokuapp.com/api/';
    hasBaseDropZoneOver = false;
    httpEmitter: Subscription;
    httpEvent: HttpEvent<Event>;
    lastFileAt: Date;


    /**
     * Inicialización de componente para cargar archivos.
     */

    sendableFormData: FormData; // populated via ngfFormData directive

    // tslint:disable-next-line:no-shadowed-variable
    constructor(public HttpClient: HttpClient) { }

    cancel() {
        this.progress = 0;
        if (this.httpEmitter) {
            console.log('cancelled');
            this.httpEmitter.unsubscribe();
        }
    }

    uploadFiles(files: File[]): Subscription {
        const req = new HttpRequest<FormData>('POST', this.url, this.sendableFormData, {
            reportProgress: true// responseType: 'text';
        });

        return this.httpEmitter = this.HttpClient.request(req)
            .subscribe(
                event => {
                    this.httpEvent = event as HttpEvent<Event>;

                    if (event instanceof HttpResponse) {
                        delete this.httpEmitter;
                        console.log('request done', event);
                    }
                },
                error => console.log('Error Uploading', error)
            );
    }

    getDate() {
        return new Date();
    }
    ngOnInit() {

    }
}
