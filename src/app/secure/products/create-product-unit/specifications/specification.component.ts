import { Component, OnInit } from '@angular/core';
import { SpecificationService } from './specification.component.service';
import { SpecificationModel } from './specification.model';
import { SpecificationDialogComponent } from './dialog/dialog.component';
import { MatDialog } from '@angular/material';

@Component({
    selector: 'app-specification-product',
    templateUrl: './specification.component.html',
    styleUrls: ['./specification.component.scss']
})

export class SpecificationProductComponent implements OnInit {

    /** Inicialización de variables */
    chargeList = false;
    specificationsGroups: SpecificationModel[] = [];
    specificationListToAdd: any[] = [];
    ShowSpecTitle = false;

    /**
     * Creates an instance of SpecificationProductComponent.
     * @param {SpecificationService} specificationService
     * @memberof SpecificationProductComponent
     */
    constructor(private specificationService: SpecificationService,
        public dialog: MatDialog) { }

    /**
     * Inicializa el componente llamando la funcion para obtener las especificaciones.
     *
     * @memberof SpecificationProductComponent
     */
    ngOnInit() {
        this.getAllSpecifications();
    }

    /**
     * Obtener todas las especificaciones del servicio de especificaciones.
     *
     * @memberof SpecificationProductComponent
     */
    public getAllSpecifications(): void {
        this.specificationService.getSpecifications().subscribe(data => {
            this.specificationsGroups = data;
            this.chargeList = true;
        }, error => {
            this.chargeList = false;
        });
    }

    /**
     * Sirve para cerar o abrir las especificaciones de un grupo.
     *
     * @param {SpecificationModel} model
     * @param {boolean} event
     * @memberof SpecificationProductComponent
     */
    public toggleSpecification(model: SpecificationModel, event: boolean): void {
        model.Show = !model.Show;
    }

    /**
     * Verifica si debe agregar una especificacion o se modifico una ya existente.
     *
     * @param {SpecificationModel} model
     * @param {number} indexParent
     * @param {number} indexSon
     * @memberof SpecificationProductComponent
     */
    public specificationChange(model: SpecificationModel, indexParent: number, indexSon: number): void {
        const cont = this.verifyExist(model, indexParent, indexSon);
        if (cont === null) {
            this.specificationListToAdd.push({
                Name: model.Name,
                Value: model.Value,
                ExistId: indexParent + '-' + indexSon
            });
        } else {
            this.specificationListToAdd[cont].Value = model.Value;
        }
    }

    /**
     * Verifica si una especificacion ya posee valor o debe crearse, usa una llave primaria creada por la
     * suma del indice del grupo de especificacion y la posicion de esta, dentro del grupo.
     *
     * @param {SpecificationModel} model
     * @param {number} indexParent
     * @param {number} indexSon
     * @returns {number}
     * @memberof SpecificationProductComponent
     */
    public verifyExist(model: SpecificationModel, indexParent: number, indexSon: number): number {
        let exist = null;
        const idCompare = indexParent + '-' + indexSon;
        let cont = 0;
        this.specificationListToAdd.forEach(data => {
            if (data.Name === model.Name && data.ExistId === idCompare) {
                exist = cont;
            }
            cont++;
        });
        return exist;
    }

    /**
     * Inicializa el modal para agregar una nueva especificacion.
     *
     * @memberof SpecificationProductComponent
     */
    public initCreateSpecification(): void {
        const dialogRef = this.dialog.open(SpecificationDialogComponent, {
            width: '800px',
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.ShowSpecTitle = true;
                this.specificationListToAdd.push({
                    Name: result.Name,
                    Value: result.Value,
                    Show: true
                });
            }
        });
    }

    /**
     * Cuando remueve una especificacion de la lista ya agregadas.
     *
     * @param {number} index
     * @memberof SpecificationProductComponent
     */
    public removeSpecification(index: number): void {
        this.specificationListToAdd.splice(index, 1);
        this.ShowSpecTitle = this.specificationListToAdd.length > 0;
    }
}
