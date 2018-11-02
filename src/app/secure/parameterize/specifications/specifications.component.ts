import { Component, OnInit, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { ParamSpecsService } from './specifications.component.service';
import { LoadingService } from '@app/core';
import { SpecificationModel } from '../../products/create-product-unit/specifications/specification.model';
import { Logger } from '@app/core';
import { AddDialogComponent } from '../dialog/dialog-add.component';
import { MatDialog } from '@angular/material';
import { MatSnackBar } from '@angular/material';

const log = new Logger('SpecificationsParamComponent');

@Component({
    selector: 'app-param-specifications',
    templateUrl: './specifications.component.html',
    styleUrls: ['./specifications.component.scss']
})

export class SpecificationsParamComponent implements OnInit, AfterViewInit {


    specificationModel = new SpecificationModel(null, null, null);
    selectedGroup: SpecificationModel;
    specificationsGroups: SpecificationModel[] = [];
    modeSave = false;
    copyGroup: any;
    constructor(
        private specificationService: ParamSpecsService,
        private loadingService: LoadingService,
        public dialog: MatDialog,
        public snackBar: MatSnackBar,
        public el: ElementRef,
    ) {

    }

    ngOnInit() {
        this.loadingService.viewSpinner();
        this.getSpecifications();
    }

    ngAfterViewInit() {
    }


    public getSpecifications(): void {
        this.specificationService.getSpecifications().subscribe(data => {
            if (data.status === 200 && data.body) {
                this.specificationsGroups = this.specificationModel.changeJsonToSpecificationModel(data.body.data);
            }
            this.loadingService.closeSpinner();
        }, error => {
            this.loadingService.closeSpinner();
            log.error('Error al intentar obtener los grupos de especificaciones');
        });
    }

    public toggleGroupSpecification(group: any): void {
        group.Show = !group.Show;

    }

    public addGroupSpec(): void {
        this.modeSave = true;
        this.openDialog(null);
    }

    public updateGroupSpec(group: any, index: any): void {
        group.EditMode = true;
        this.copyGroup = Object.assign({}, group);
        console.log(this.copyGroup);
    }

    public blurInput(group: any): void {
        console.log(group);
        console.log(this.copyGroup);
        group.EditMode = false;
    }

    public openDialog(data: any): void {
        const dialogRef = this.dialog.open(AddDialogComponent, {
            width: '600px',
            data: data
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed', result);
            this.saveGroupSpec(result);
        });

    }

    public saveGroupSpec(data: any): void {
        if (data) {
            this.loadingService.viewSpinner();
            if (this.modeSave) {
                this.specificationService.addSpecification(data).subscribe(result => {
                    if (result.status === 200 && result.body) {
                        this.snackBar.open('Agrego correctamente un grupo de especificaciones', 'Cerrar', {
                            duration: 3000,
                        });
                        this.getSpecifications();
                    } else {
                        log.error('Error al intentar guardar un grupo de especificaciones');
                    }
                    this.loadingService.closeSpinner();
                }, error => {
                    this.loadingService.closeSpinner();
                    log.error('Error al intentar guardar un grupo de especificaciones');
                });
            } else {
                this.selectedGroup.Name = data.NameSpec;
                this.specificationService.updateSpecification(data).subscribe(result => {
                    if (result.status === 200 && result.body) {
                        this.snackBar.open('Actualizo correctamente el grupo de especificaciones', 'Cerrar', {
                            duration: 3000,
                        });
                        this.getSpecifications();
                    } else {
                        log.error('Error al intentar guardar un grupo de especificaciones');
                    }
                    this.loadingService.closeSpinner();
                }, error => {
                    this.loadingService.closeSpinner();
                    log.error('Error al intentar guardar un grupo de especificaciones');
                });
            }
        }
    }


}
