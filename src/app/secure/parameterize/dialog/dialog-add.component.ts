import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SearchService } from '@app/secure/products/create-product-unit/categorization/search.component.service';
import { Logger, LoadingService } from '@app/core';

/* log component */
const log = new Logger('SearchCategorizationComponent');


/**
 * Component dialogo para agregar nuevas especificaciones o marcas. dependiendo de como se inicialicen el componente
 * con data.type es marca (Brand) y sin ese atributo es Specifications (specs).
 * @export
 * @class AddDialogComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-add-dialog',
    templateUrl: 'dialog-add.component.html',
    styleUrls: ['../specifications/specifications.component.scss']
})


export class AddDialogComponent implements OnInit {

    /**
     * Initializacion de variables del componente.
     *
     * @memberof AddDialogComponent
     */
    modeDialog: boolean;
    typeModel = 0;
    formSpecs: FormGroup;
    formBrands: FormGroup;
    listCategories: any[] = [];

    /**
     * Creates an instance of AddDialogComponent.
     * @param {MatDialogRef<AddDialogComponent>} dialogRef
     * @param {*} data
     * @memberof AddDialogComponent
     */
    constructor(
        public dialogRef: MatDialogRef<AddDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private searchService: SearchService,
        private loadingService: LoadingService) {
        this.modeDialog = data !== null;
        if (data) {
            this.typeModel = data.type;
            this.createAddBrandFrom();
        } else {
            if (!this.modeDialog) {
                this.createAddSpecForm(null);
            } else {
                this.createAddSpecForm(data);
            }
        }
    }

    ngOnInit() {
        // this.loadingService.viewSpinner();
        this.getCategoriesList();
    }

    /**
     * Cierra el componente dialogo sin ninguna repsuesta.
     *
     * @memberof AddDialogComponent
     */
    close(): void {
        this.dialogRef.close();
    }


    public createAddBrandFrom(): void {
        this.formBrands = new FormGroup({
            NameBrand: new FormControl('', Validators.required),
            Categories: new FormControl('')
        });
    }


    /**
     * Se organiza la lista de categorias para encontrar las que no poseen hijo y organizar esta lista.
     *
     * @param {*} data
     * @memberof AddDialogComponent
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
            console.log(this.listCategories);
            // this.loadingService.closeSpinner();
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
        });
    }


    /**
     * Crea el formulario reactivo de specifications.
     *
     * @param {*} data
     * @memberof AddDialogComponent
     */
    public createAddSpecForm(data: any): void {
        let name = null;
        if (data) {
            name = data.Name;
        }
        this.formSpecs = new FormGroup({
            NameSpec: new FormControl(name, [
                Validators.required
            ])
        });
    }

    /**
     * Cierra el dialogo enviando como respuesta el model del formulario.
     *
     * @memberof AddDialogComponent
     */
    public saveSpecGroup(): void {
        if (this.formSpecs.valid) {
            this.dialogRef.close(this.formSpecs.value);
        }
    }
}
