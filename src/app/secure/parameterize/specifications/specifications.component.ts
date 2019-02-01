import { Component, OnInit, ElementRef, AfterViewInit, Renderer, Directive, OnChanges, Input } from '@angular/core';
import { ParamSpecsService } from './specifications.component.service';
import { LoadingService } from '@app/core';
import { SpecificationModel } from '../../products/create-product-unit/specifications/specification.model';
import { Logger } from '@app/core';
import { AddDialogComponent } from '../dialog/dialog-add.component';
import { MatDialog } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { SearchService } from '@app/secure/products/create-product-unit/categorization/search.component.service';
import { AddDialogSpecsComponent } from '../dialogAddSpecs/dialog-add-specs.component';
import { DeleteDialogSpecsComponent } from '../dialogDelete/dialog-delete.component';

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
    listCategories: any[] = [];
    groupDelete: any;
    specDelete: any;
    constructor(
        private specificationService: ParamSpecsService,
        private loadingService: LoadingService,
        public dialog: MatDialog,
        private searchService: SearchService,
        public snackBar: MatSnackBar,
        public el: ElementRef,
        private render: Renderer
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
            console.log('data: ', data);
            if (data.status === 200 && data.body) {
                this.specificationsGroups = this.specificationModel.changeJsonToSpecificationModel(data.body.data);
                this.getCategoriesList();
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
    }

    public blurInput(data: any, isGroup: boolean): void {
        data.EditMode = false;
    }

    public openDialog(data: any): void {
        // data.categories = this.listCategories;
        const dialogRef = this.dialog.open(AddDialogComponent, {
            width: '90%',
            maxWidth: '1000px',
            data: data
        });

        dialogRef.afterClosed().subscribe(result => {
            this.saveGroupSpec(result);
        });

    }

    public openDialogAddSpecs(data: any): void {
        // data.categories = this.listCategories;
        const dialogRef = this.dialog.open(AddDialogSpecsComponent, {
            width: '90%',
            maxWidth: '1000px',
            data: data
        });

        dialogRef.afterClosed().subscribe(result => {
            // this.saveGroupSpec(result);
        });

    }

    /**
     * Dialog para eliminar grupo de specs
     *
     * @param {*} data
     * @memberof SpecificationsParamComponent
     */
    public openDialogDeleteSpecsandGroupSpec(data: any): void {
        // data.categories = this.listCategories;
        const dialogRef = this.dialog.open(DeleteDialogSpecsComponent, {
            width: '90%',
            maxWidth: '1000px',
            data: data
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loadingService.viewSpinner();
                if (this.groupDelete) {
                    this.specificationService.deleteGroupSpecification(this.groupDelete).subscribe(res => {
                        console.log(result);
                        res = result;
                        this.groupDelete = '';
                        if (result.status === 200 && result.body) {
                            this.snackBar.open('Has eliminado correctamente un grupo de especificaciones', 'Cerrar', {
                                duration: 3000,
                            });
                            this.getCategoriesList();
                        } else {
                            log.error('Error al intentar eliminar un grupo de especificaciones');
                        }
                        this.loadingService.closeSpinner();
                    }, error => {
                        this.loadingService.closeSpinner();
                        log.error('Error al intentar eliminar un grupo de especificaciones');
                        this.getCategoriesList();
                    });
                } else
                    if (this.specDelete) {
                        this.specificationService.deleteGroupSpecification(this.groupDelete).subscribe(res => {
                            console.log(result);
                            res = result;
                            this.groupDelete = '';
                            if (result.status === 200 && result.body) {
                                this.snackBar.open('Has eliminado correctamente una especificación', 'Cerrar', {
                                    duration: 3000,
                                });
                                this.getCategoriesList();
                            } else {
                                log.error('Error al intentar eliminar una especificación');
                            }
                            this.loadingService.closeSpinner();
                        }, error => {
                            this.loadingService.closeSpinner();
                            log.error('Error al intentar eliminar una especificación');
                            this.getCategoriesList();
                        });
                    }
            }
            // this.saveGroupSpec(result);
        });

    }

    public organizeCategoiesList(data: any): void {
        if (data && data.length) {
            data.forEach(element => {
                let exist = false;
                data.forEach(sons => {
                    if (element.Id === sons.IdParent) {
                        exist = true;
                    }
                });
                if (!exist) {
                    this.listCategories.push(element);
                }
            });
        }
    }

    /**
     * Get categories from service, and storage in list categories.
     *
     * @memberof SearchCategorizationComponent
     */
    public getCategoriesList(): void {
        this.searchService.getCategories().subscribe((result: any) => {
            // guardo el response
            console.log('result: ', result);
            if (result.status === 200) {
                const body = JSON.parse(result.body.body);
                this.organizeCategoiesList(body.Data);
            } else {
                log.debug('SearchCategorizationComponent:' + result.message);
            }
        });
    }


    public toggleEdit(param: any, param2: any): void {
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

    public addSpec(data: any): void {
        this.modeSave = true;
        this.openDialogAddSpecs(null);
        /*
        data.ShowNewSon = true;
        const element = this.render.selectRootElement('#input1'); */
    }

    public removeSpec(data: any): void {
        this.modeSave = true;
        this.openDialogDeleteSpecsandGroupSpec(null);
        this.groupDelete = data;
        /*
        data.ShowNewSon = true;
        const element = this.render.selectRootElement('#input1'); */
    }



    public onBlurMethod(group: any): void {
        const dataToSend = group.newSpecification;
        group.newSpecification = null;
        group.ShowNewSon = false;
        group.Sons.push({
            Name: dataToSend,
        });
        this.snackBar.open('Agrego correctamente una especificación', 'Cerrar', {
            duration: 3000,
        });
    }

    public onKeydown(key: any, group: any) {
        if (key.keyCode === 13) {
            this.onBlurMethod(group);
        }
    }

    public initUpdateSpec(group: any, spec: any): void {
        spec.EditMode = true;
    }

    public deleteSpec(group: any, index: number): void {
        group.Sons.splice(index, 1);
    }

}

@Directive({
    selector: '[appFocus]'
})
export class FocusDirective implements OnInit {
    @Input('focus') focus: boolean;
    constructor(private elementRef: ElementRef,
        private renderer: Renderer) {
        setTimeout(function () {
            elementRef.nativeElement.focus();
        }, 300);
    }
    ngOnInit() {
    }
}
