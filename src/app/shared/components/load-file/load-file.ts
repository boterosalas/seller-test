import { Component, OnInit, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { HttpEvent, HttpRequest, HttpClient } from '@angular/common/http';
import { HttpResponse } from 'aws-sdk/global';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
    selector: 'app-load-file',
    templateUrl: 'load-file.html',
    styleUrls: ['load-file.scss']
})

export class LoadFileComponent implements OnInit {

    /**
     * Se inicialia los datos necesarios para hacer uso de la libreria para adjuntar archivos.
     *
     * @memberof LoadFileComponent
     */
    accept = '*';
    files: File[] = [];
    progress: number;
    url = 'https://evening-anchorage-3159.herokuapp.com/api/';
    hasBaseDropZoneOver = false;
    httpEmitter: Subscription;
    httpEvent: HttpEvent<Event>;
    lastFileAt: Date;
    maxSize = 3145728;
    lastInvalids: any;
    dataToSend: any;

    /**
     * Inicialización de componente para cargar archivos.
     */

    sendableFormData: FormData; // populated via ngfFormData directive

    // tslint:disable-next-line:no-shadowed-variable
    constructor(public HttpClient: HttpClient,
        public dialogRef: MatDialogRef<LoadFileComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
            this.dataToSend = data;
        }

    ngOnInit() {}

    /**
     * Si se necesita cancelar la subida de archivos a back.
     * Aunque por ahora esta sin uso ...
     *
     * @memberof LoadFileComponent
     */
    public cancel(): void {
        this.progress = 0;
        if (this.httpEmitter) {
            this.httpEmitter.unsubscribe();
        }
    }

    /**
     * Verifica aunque el boton esta bloqueado si no existen errores y hay archivos para cargar
     *
     * @memberof LoadFileComponent
     */
    public saveFile(): void {
        if ( (!this.lastInvalids || !this.lastInvalids.length) && this.files.length) {
            this.uploadFiles([this.files[this.files.length - 1]]);
        }
    }

    /**
     * Funcion para enviar documento a back y guardarlo
     *
     * @param {File[]} files
     * @returns {Subscription}
     * @memberof LoadFileComponent
     */
    public uploadFiles(files: File[]): Subscription {
        const req = new HttpRequest<FormData>('POST', this.url, this.sendableFormData, {
            reportProgress: true// responseType: 'text';
        });

        return this.httpEmitter = this.HttpClient.request(req)
            .subscribe(
                event => {
                    this.httpEvent = event as HttpEvent<Event>;

                    if (event instanceof HttpResponse) {
                        delete this.httpEmitter;
                        this.dialogRef.close(true);
                    }
                },
                error => console.log('Error Uploading', error)
            );
    }

    /**
     * Obitene la fecha actual
     *
     * @returns
     * @memberof LoadFileComponent
     */
    public getDate(): Date {
        return new Date();
    }
}
