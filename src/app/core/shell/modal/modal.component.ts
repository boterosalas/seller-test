import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Logger } from '../../utilities/logger.service';

const log = new Logger('ModalComponent');

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss']
})

export class ModalComponent implements OnInit {

    public message: string;
    public status: string;
    public title: string;

    /**
     * Creates an instance of ModalComponent.
     * @memberof ModalComponent
     */
    constructor(
        public dialog: MatDialog
    ) { }

    /**
     * @memberof ModalComponent
     */
    ngOnInit() {
    }

    /**
     * @param status
     * @method showModal Metodo para mostrar el modal
     * @memberof ModalComponent
     */
    showModal(status) {
        let dataModal: any;
        const dialogRef = this.dialog.open(ModalComponent, {
            height: '473px',
            width: '760px'
        });
        switch (status) {
            case 'success':
                dataModal = {
                    'status': 'done',
                    'message': `'¡Tú registro ha sido exitoso! Próximamente recibirás un correo electrónico confirmando el usuario
                y contraseña de acceso de este vendedor al Seller Center. En este correo también recibirás el ID de
                vendedor para su registro.'`,
                    'title': '¡Registro realizado con exíto!'
                };
                break;
            case 'error':
                dataModal = {
                    'status': 'clear',
                    'message': `¡Tú registro ha sido rechazado! Por favor revisa que todos los campos cumplan con las debidas
                validaciones. Cualquier duda con las reglas de registro por favor consultar el manual de uso del
                formulario.`,
                    'title': '¡El registro no se pudo realizar!'
                };
                break;
            case 'errorService':
                dataModal = {
                    'status': 'clear',
                    'message': `¡Estamos teniendo problemas! Por favor, vuelve a cargar la página para diligenciar nuevamente la
                información. Disculpa este inconveniente`,
                    'title': '¡Oops!.'
                };
                break;
            case 'soldOut':
            dataModal = {
                'status': 'clear',
                'message': `¡Este producto esta agotado!
                Por favor intenta con otro`,
                'title': '¡Oops!.'
            };
                break;
        }
        dialogRef.componentInstance.status = dataModal.status;
        dialogRef.componentInstance.message = dataModal.message;
        dialogRef.componentInstance.title = dataModal.title;
    }

    /**
     * @method reloadPage
     * @memberof ModalComponent
     * Metodo para recargar la página
     */
    reloadPage() {
        window.location.reload();
    }

}
