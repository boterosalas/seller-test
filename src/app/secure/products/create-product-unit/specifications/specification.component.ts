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

    /**
     * Creates an instance of SpecificationProductComponent.
     * @param {SpecificationService} specificationService
     * @memberof SpecificationProductComponent
     */
    constructor(private specificationService: SpecificationService,
        public dialog: MatDialog) { }
    ngOnInit() {
        this.getAllSpecifications();
    }

    public getAllSpecifications(): void {
        this.specificationService.getSpecifications().subscribe(data => {
            this.specificationsGroups = data;
            this.chargeList = true;
        }, error => {
            this.chargeList = false;

        });
    }

    public toggleSpecification(model: SpecificationModel): void {
        model.Show = !model.Show;
    }

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

    public initCreateSpecification(): void {

        const dialogRef = this.dialog.open(SpecificationDialogComponent, {
            width: '250px',
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed', result);
        });
    }
}
