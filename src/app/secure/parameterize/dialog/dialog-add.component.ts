import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SearchService } from '@app/secure/products/create-product-unit/categorization/search.component.service';
import { Logger } from '@app/core';

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
    categoriesAdded = [];
    showCategoriesAdded = false;
    categoriesError = [];
    categoriesAddedError = [];
    dataToEdit: any;
    /**
     * Creates an instance of AddDialogComponent.
     * @param {MatDialogRef<AddDialogComponent>} dialogRef
     * @param {*} data
     * @memberof AddDialogComponent
     */
    constructor(
        public dialogRef: MatDialogRef<AddDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private searchService: SearchService) {
        this.modeDialog = data !== null && data.Categories;
        this.dataToEdit = data;
        this.listCategories = data.listCategories;
        if (!this.modeDialog) {
            this.createAddSpecForm(null);
        } else {
            this.createAddSpecForm(data);
            data.Categories.forEach(element => {
                this.addCategory(element);
            });
        }
        this.formSpecs.controls.Categories.enable();
    }

    ngOnInit() {
    }

    /**
     * Cierra el componente dialogo sin ninguna repsuesta.
     *
     * @memberof AddDialogComponent
     */
    close(): void {
        this.dialogRef.close();
    }

    public toogleCategories(change: boolean): void {
        this.showCategoriesAdded = !this.showCategoriesAdded;
    }

    public changeSlider(event: any): void {
        this.categoriesAdded = [];
        if (event.checked) {
            this.listCategories.forEach(element => {
                this.categoriesAdded.push(element);
            });
        }
    }

    public createAddBrandFrom(): void {
        this.formBrands = new FormGroup({
            NameBrand: new FormControl('', Validators.required)
        });
    }

    public addCategory(word: string): boolean {
        try {
            const value = word;
            if (value) {
                const resultado = this.listCategories.find(element => element.Id === parseFloat(value));
                const resultadoAdd = this.categoriesAdded.find(element => element.Id === parseFloat(value));
                if (resultado) {
                    this.setCategoryError(false);
                    if (!resultadoAdd) {
                        this.categoriesAdded.push(resultado);
                        this.formSpecs.controls.Categories.setValue(this.formSpecs.controls.Categories.value.replace(value, ''));
                        this.formSpecs.controls.Categories.setValue(this.formSpecs.controls.Categories.value.replace(',', ''));
                        return false;
                    } else {
                        // this.setCategoryError(true, true); // repetidos
                        this.categoriesAddedError.push(value);
                        return true;
                    }
                } else {
                    // this.setCategoryError(true); // no existe la categoria
                    this.categoriesError.push(value);
                    return true;
                }
            }
        } catch (e) {
            return true;
        }
    }

    public getCategories(): any {
        const word = this.formSpecs.controls.Categories.value;
        if (word) {
            this.categoriesAddedError = [];
            this.categoriesError = [];
            let errors = false;
            if (word.search(',') === -1) {
                errors = this.addCategory(word);
            } else {
                const counter = word.split(',');
                counter.forEach(element => {
                    const errorFrom = this.addCategory(element);
                    if (element) {
                        errors = errors === false ? errorFrom : true;
                    }
                });
            }
            this.setCategoryError(errors);
        }
    }

    public setCategoryError(show: boolean): void {
        const ErrorAdded = this.categoriesAddedError.length > 0;
        const ErrorNoExist = this.categoriesError.length > 0;
        if (show) {

            if (ErrorAdded && ErrorNoExist) {
                this.formSpecs.controls.Categories.setErrors({ existAdded: show, noExist: show });
            } else if (ErrorAdded) {
                this.formSpecs.controls.Categories.setErrors({ existAdded: show });
            } else if (ErrorNoExist) {
                this.formSpecs.controls.Categories.setErrors({ noExist: show });
            }
        } else {
            this.formSpecs.controls.Categories.setErrors(null);
        }
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
            this.formSpecs.controls.Categories.enable();
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
                Validators.required,
                Validators.maxLength(200)
            ]),
            Categories: new FormControl({ value: '', disabled: true })
        });
    }

    /**
     * Cierra el dialogo enviando como respuesta el model del formulario.
     *
     * @memberof AddDialogComponent
     */
    public saveSpecGroup(): void {
        if (this.formSpecs.valid && !this.formSpecs.controls.Categories.value) {
            const data = this.formSpecs.value;
            data.Categories = this.categoriesAdded;
            data.Id = this.dataToEdit.Id;
            this.dialogRef.close(data);
        }
    }

    public deleteCategory(i: number): void {
        this.categoriesAdded.splice(i, 1);
    }
}
