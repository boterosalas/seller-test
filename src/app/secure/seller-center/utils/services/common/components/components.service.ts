/* 3rd party components */
import { MatSnackBar, MatDialog } from '@angular/material';
import { Injectable } from '@angular/core';

/* our own custom components */
import { ConfirmAlertComponent } from '../../../../components/confirm-alert/confirm-alert.component';

@Injectable()

export class ComponentsService {

    /**
     * Creates an instance of ComponentsService.
     * @param {MatSnackBar} snackBar
     * @param {MatDialog} dialog
     * @memberof ComponentsService
     */
    constructor(public snackBar: MatSnackBar, public dialog: MatDialog) { }

    /**
     * Método para desplegar el snackbar de material
     * @param {string} message
     * @param {string} action
     * @param {any} [duration]
     * @memberof ComponentsService
     */
    openSnackBar(message: string, action: string, duration?) {
        // tslint:disable-next-line:curly
        if (duration === null || duration === undefined) {
            duration = 2000;
        }
        this.snackBar.open(message, action, {
            duration: duration,
        });
    }

    /**
     * Método para despelgar el modal de confirmación
     * @param {string} title
     * @param {string} [description]
     * @returns
     * @memberof ComponentsService
     */
    openConfirmAlert(title: string, description?: string, ) {
        const promise = new Promise((resolve, reject) => {
            const dialogRef = this.dialog.open(ConfirmAlertComponent, {
                width: '360px',
                data: {
                    title: title,
                    description: description || null
                }
            });
            dialogRef.afterClosed().subscribe(result => {
                resolve(result);
            });
        });
        return promise;
    }
}
