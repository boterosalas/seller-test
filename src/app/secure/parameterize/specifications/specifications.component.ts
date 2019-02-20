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
    groupSpecToAdd: any;
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
        this.getSpecifications(true);
    }

    ngAfterViewInit() {
    }

    /**
     * Obtiene las especificaciones y las categories.
     * Posee una variable para indicar que no debe obtener las categorias.
     *
     * @param {boolean} [getCategories=true]
     * @memberof SpecificationsParamComponent
     */
    public getSpecifications(getCategories: boolean = false): void {
        this.specificationService.getConfigSpecifications().subscribe(data => {
            if (data.status === 200 && data.body) {
                this.specificationsGroups = this.specificationModel.changeJsonToSpecificationModel(data.body.data);
            }
            if (getCategories) {
                this.getCategoriesList();
            } else {
                this.loadingService.closeSpinner();
            }
        }, error => {
            if (!getCategories) {
                this.loadingService.closeSpinner();
            }
            this.loadingService.closeSpinner();
            log.error('Error al intentar obtener los grupos de especificaciones', error);
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
        this.modeSave = false;
        this.openDialog(group);
    }

    public blurInput(data: any, isGroup: boolean): void {
        data.EditMode = false;
    }

    public openDialog(data: any): void {
        // data.categories = this.listCategories;
        if (data) {
            data.listCategories = this.listCategories;
        } else {
            data = {
                listCategories: this.listCategories
            };
        }
        const dialogRef = this.dialog.open(AddDialogComponent, {
            width: '90%',
            maxWidth: '1000px',
            data: data
        });

        dialogRef.afterClosed().subscribe(result => {
            this.saveGroupSpec(result);
        });

    }

    public openDialogAddSpecs(data: any, index?: number): void {
        // data.categories = this.listCategories;
        let dataToEdit = null;
        if (index !== null && index !== undefined) {
            dataToEdit = data.Sons[index];
        }
        const dialogRef = this.dialog.open(AddDialogSpecsComponent, {
            width: '90%',
            maxWidth: '1000px',
            minHeight: '50%',
            data: dataToEdit
        });

        dialogRef.afterClosed().subscribe(res => {
            if (res) {
                let dataToSend = null;
                dataToSend = {
                    Specs: [],
                    ListCategories: [],
                    GroupName: this.groupSpecToAdd.Name,
                    IdGroup: this.groupSpecToAdd.Id,
                };
                dataToSend.Specs.push({
                    SpecName: res.nameSpec,
                    Required: res.requiredSpec === true ? 'true' : 'false',
                    ListValues: !res.ListValues ?  [] : res.ListValues ,
                    IdSpec: res.idSpec
                });
                if (!data) {
                    this.specificationService.createConfigSpecifications(dataToSend).subscribe(result => {
                        if (result.status === 200 && result.body) {
                            this.snackBar.open('Agrego correctamente', 'Cerrar', {
                                duration: 3000,
                            });
                        } else {
                            log.error('Error al intentar guardar una especificacion o un grupo');
                        }
                        this.getSpecifications();
                    }, error => {
                        this.getSpecifications();
                        log.error('Error al intentar guardar una especificacion o un grupo');
                    });
                } else {
                    this.specificationService.updateConfigSpecifications(dataToSend).subscribe(result => {
                        if (result.status === 200 && result.body) {
                            this.snackBar.open('Actualizó correctamente', 'Cerrar', {
                                duration: 3000,
                            });
                        } else {
                            log.error('Error al intentar guardar una especificacion o un grupo');
                        }
                        this.getSpecifications();
                    }, error => {
                        this.getSpecifications();
                        log.error('Error al intentar guardar una especificacion o un grupo');
                    });
                }
            }
        });
    }


    /**
     * Se eliminar de la lista de grupos de especificaciones, la especificación seleccionada por el usuario.
     *
     * @param {*} data
     * @memberof SpecificationsParamComponent
     */
    public deleteSpecFromList(data: any): void {
        this.specificationsGroups.forEach((element, i) => {
            element.Sons.forEach((spec, e) => {
                if (spec.Id === data.Id) {
                    this.specificationsGroups[i].Sons.splice(e, 1);
                }
            });
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

        dialogRef.afterClosed().subscribe(res => {
            if (res) {
                this.loadingService.viewSpinner();
                this.specificationService.deleteConfigSpecifications(this.groupDelete.Id).subscribe(result => {
                    this.groupDelete = '';
                    if (result.status === 200 && result.body) {
                        if (!data) {
                            this.snackBar.open('Has eliminado correctamente un grupo de especificaciones', 'Cerrar', {
                                duration: 3000,
                            });
                            this.getSpecifications();
                        } else {
                            this.snackBar.open('Has eliminado correctamente una especificación', 'Cerrar', {
                                duration: 3000,
                            });
                            this.deleteSpecFromList(data);
                            this.loadingService.closeSpinner();
                        }
                    } else {
                        log.error('Error al intentar eliminar');
                    }
                }, error => {
                    log.error('Error al intentar eliminar');
                    this.getSpecifications();
                });
            }
        });

    }

    /**
     * Organiza la lista de especificaciones ya que solo debe poder asociar a los grupos solo aquellas que no posee.
     *
     * @param {*} data
     * @memberof SpecificationsParamComponent
     */
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
            if (result.status === 200) {
                const body = JSON.parse(result.body.body);
                this.organizeCategoiesList(body.Data);
            } else {
                log.debug('SearchCategorizationComponent:' + result.message);
            }
            this.loadingService.closeSpinner();
        }, error => {
            this.loadingService.closeSpinner();
        });
        this.loadingService.closeSpinner();
    }


    public toggleEdit(param: any, param2: any): void {
    }

    public saveGroupSpec(data: any): void {
        if (data) {
            this.loadingService.viewSpinner();
            const dataToSend = {
                GroupName: data.NameSpec,
                Specs: [],
                ListCategories: [],
                IdGroup: null,
                Id: null
            };
            data.Categories.forEach(element => {
                dataToSend.ListCategories.push(element.Id.toString());
            });
            if (this.modeSave) {
                this.specificationService.createConfigSpecifications(dataToSend).subscribe(result => {
                    if (result.status === 200 && result.body) {
                        this.snackBar.open('Agrego correctamente', 'Cerrar', {
                            duration: 3000,
                        });
                    } else {
                        log.error('Error al intentar guardar una especificacion o un grupo');
                    }
                    this.getSpecifications();
                }, error => {
                    this.getSpecifications();
                    log.error('Error al intentar guardar una especificacion o un grupo');
                });
            } else {
                dataToSend.IdGroup = data.Id;
                dataToSend.Id = data.Id;
                this.specificationService.updateConfigSpecifications(dataToSend).subscribe(result => {
                    if (result.status === 200 && result.body) {
                        this.snackBar.open('Actualizo correctamente', 'Cerrar', {
                            duration: 3000,
                        });
                    } else {
                        log.error('Error al intentar actualizar una especificacion o un grupo');
                    }
                    this.getSpecifications();
                }, error => {
                    this.getSpecifications();
                    log.error('Error al intentar actualizar una especificacion o un grupo');
                });
            }
        }
    }

    public editSpec(data: any, index: number): void {
        this.groupSpecToAdd = data;
        this.openDialogAddSpecs(data, index);
    }

    public addSpec(data: any): void {
        this.modeSave = true;
        this.groupSpecToAdd = data;
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
        this.groupDelete = group.Sons[index];
        this.openDialogDeleteSpecsandGroupSpec(this.groupDelete);
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
