import { Component, OnInit, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { HttpEvent, HttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { CommonService } from '@app/shared/services/common.service';
import { Logger } from '@app/core';

const log = new Logger('LoadFileComponent');
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
    hasBaseDropZoneOver = false;
    httpEmitter: Subscription;
    httpEvent: HttpEvent<Event>;
    lastFileAt: Date;
    maxSize = 3145728;
    lastInvalids: any;
    dataToSend: any;
    showProgress = false;
    validComboDrag = true;
    dragFiles = true;
    file = null;


    /**
     * Inicialización de componente para cargar archivos.
     */

    sendableFormData: FormData; // populated via ngfFormData directive

    // tslint:disable-next-line:no-shadowed-variable
    constructor(public HttpClient: HttpClient,
        public dialogRef: MatDialogRef<LoadFileComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private service: CommonService,
        public snackBar: MatSnackBar) {
        this.dataToSend = data;
    }

    ngOnInit() { }

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
        if ((!this.lastInvalids || !this.lastInvalids.length) && this.files.length) {
            this.uploadFiles();
        }
    }

    public getBase64(file: any): any {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    /**
     * Funcion para enviar documento a back y guardarlo
     *
     * @param {File[]} files
     * @returns {Subscription}
     * @memberof LoadFileComponent
     */
    public uploadFiles(): void {
        const lengthFiles = document.getElementById('pdf').getElementsByTagName('input')[0].files.length;
        let file = document.getElementById('pdf').getElementsByTagName('input')[0].files[lengthFiles - 1];
        if (!file) {
            file = this.files[this.files.length - 1];
        }
        this.showProgress = true;
        this.getBase64(file).then(data => {
            try {
                const bodyToSend = {
                    IdOrder: this.dataToSend.body.id,
                    Base64Pdf: data.slice(data.search('base64') + 7, data.length)
                };
                this.service.postBillOrders(bodyToSend).subscribe(result => {
                    if (result.body.data) {
                        // Success
                        this.snackBar.open(result.body.message, 'Cerrar', {
                            duration: 3000,
                        });
                        this.dialogRef.close(true);
                    } else {
                        // Error
                        this.snackBar.open(result.body.message, 'Cerrar', {
                            duration: 3000,
                        });
                    }
                    this.showProgress = false;
                }, error => {
                    // Error
                    this.snackBar.open('No se pudo adjuntar el PDF, ocurrió un error.', 'Cerrar', {
                        duration: 3000,
                    });
                    log.error(error);
                    this.showProgress = false;
                });

            } catch (e) {
                log.error('error al intentar transformar el pdf', e);
            }
        });
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
