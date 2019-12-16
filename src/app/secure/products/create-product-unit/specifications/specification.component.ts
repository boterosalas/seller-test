import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { SpecificationService } from './specification.component.service';
import { SpecificationModel } from './specification.model';
import { SpecificationDialogComponent } from './dialog/dialog.component';
import { MatDialog } from '@angular/material';
import { Logger } from '@app/core';
import { ProcessService } from '../component-process/component-process.service';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { EanServicesService } from '../validate-ean/ean-services.service';

const log = new Logger('SpecificationProductComponent');

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
    specificationModel = new SpecificationModel(null, null, null);
    specsForm: FormControl;
    changeForm = false;
    isLoad = false;
    _detailProduct: any;
    idCategory: number;
    dataSpecification: any;
    @Input() set detailProduct(value: any) {
        if (value) {
            this._detailProduct = value;
            this.idCategory = parseInt(value.categoryId, 0);
        }
    }
    @Input() ean: any;

    /**
     * Creates an instance of SpecificationProductComponent.
     * @param {SpecificationService} specificationService
     * @memberof SpecificationProductComponent
     */
    constructor(
        private specificationService: SpecificationService,
        public dialog: MatDialog,
        public processService: ProcessService,
        private languageService: TranslateService) {
        this.listSpecification();
    }

    /**
     * Inicializa el componente llamando la funcion para obtener las especificaciones.
     *
     * @memberof SpecificationProductComponent
     */
    ngOnInit() { }

    listSpecification() {
        this.specsForm = new FormControl();
        this.processService.isLoad.subscribe(result => {
            this.isLoad = result;
        });
        if (this.processService.specsByCategory) {
            this.processService.specsByCategory.subscribe(result => {
                this.isLoad = false;
                if (result && result.data) {
                    this.dataSpecification = result.data;
                    this.specificationsGroups = this.specificationModel.changeJsonToSpecificationModel(result.data);
                    this.setSpecification(result.data);
                    const views = this.processService.getViews();
                    views.showSpec = false;
                    this.processService.setViews(views);
                } else {
                    this.specificationsGroups = [];
                    const views = this.processService.getViews();
                    views.showSpec = false;
                    this.processService.setViews(views);
                }
                this.chargeList = true;
            });
        }
    }


    setSpecification(data: any) {
        if (this.idCategory) {
            if (data && data.length > 0) {
                let count = 0;
                data.forEach(element => {
                    let specf = element.categories.replace(/'/g, '"');
                    specf = JSON.parse(specf).find(x => x === this.idCategory.toString());
                    if (specf) {
                        this.specificationsGroups[count].Show = true;
                    }
                    count++;
                });
            }

        }
    }

    public validateObligatoryGroup(group: any): boolean {
        let hasSon = false;
        group.Sons.forEach(element => {
            if (element.Required && !element.Value) {
                hasSon = true;
            }
        });
        return hasSon;
    }

    public validForm(form: any): void {
        const views = this.processService.getViews();
        views.showSpec = !form;
        this.processService.setViews(views);
    }

    /**
     * Obtener todas las especificaciones del servicio de especificaciones.
     *
     * @memberof SpecificationProductComponent
     */
    public getAllSpecifications(): void {
        this.specificationService.getSpecifications().subscribe(data => {
            if (data.status === 200) {
                this.specificationsGroups = this.specificationModel.changeJsonToSpecificationModel(data.body.data);
            }
            this.chargeList = true;
        }, error => {
            this.chargeList = false;
            log.error(this.languageService.instant('secure.products.create_product_unit.specifications.error_has_occured_uploading'));
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
                Name: model.Label,
                Key: model.Label,
                Value: model.Value,
                ExistId: indexParent + '-' + indexSon
            });
        } else {
            this.specificationListToAdd[cont].Value = model.Value;
        }
        this.validFeatureData();
    }

    public validFeatureData(): void {
        const list = [];
        this.specificationListToAdd.forEach(element => {
            if (element.Value) {
                list.push(element);
            }
        });
        this.processService.setFeatures(list);
    }

    public showError(index: number, form: any): string {
        try {
            if (form.controls['specs' + index] && form.controls['specs' + index].errors && form.controls['specs' + index].dirty) {
                const errors = Object.keys(form.controls['specs' + index].errors);
                switch (errors[0]) {
                    case 'required':
                        return this.languageService.instant('secure.products.create_product_unit.specifications.field_mandatory');
                        break;
                    case 'pattern':
                        return this.languageService.instant('secure.products.create_product_unit.specifications.200_characters');
                        break;
                    default:
                        return this.languageService.instant('secure.products.create_product_unit.specifications.error_field');
                }
            }
        } catch (e) {
            return null;
        }
        return null;
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
                    Key: result.Name,
                    Value: result.Value,
                    Show: true
                });
                this.validFeatureData();
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
        let cont = false;
        for (let i = 0; i < this.specificationListToAdd.length; i++) {
            if (this.specificationListToAdd[i].Show) {
                cont = true;
            }
        }
        this.validFeatureData();
        this.ShowSpecTitle = cont;
    }

    setValueSpefici(index: number, form: any, inputSpecifications: any) {
        if (inputSpecifications && inputSpecifications.Label) {
            if (this._detailProduct && this._detailProduct.features.length > 0) {
                const valueArray = this._detailProduct.features.find(x => x.key === inputSpecifications.Label);
                let value = '';
                if (valueArray !== undefined && valueArray !== null) {
                    if (valueArray.value === null || valueArray.value === undefined) {
                        value = '';
                    } else {
                        value = valueArray.value;
                    }
                }
                if (form && form.form) {
                    if (form.form.controls['specs' + index]) {
                        form.controls['specs' + index].setValue(value);
                    }
                }
            }
        }
    }

}
