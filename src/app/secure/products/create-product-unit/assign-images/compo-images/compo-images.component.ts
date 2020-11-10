import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ComponentsService } from '@app/shared';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-compo-images',
    templateUrl: './compo-images.component.html',
    styleUrls: ['./compo-images.component.scss']
})

export class CompoImagesComponent implements OnInit {
    public urlArrayDad: any = ['', '', '', '', ''];
    @Output() toPpal = new EventEmitter();
    _arrayImageDadClothing: any = ['', '', '', '', ''];
    _arrayImageDadTecnology: any = ['', '', '', '', ''];
    @Input() hijosArrTmp: any;
    @Output() imagePush = new EventEmitter();
    @Input() set arrayImageDadClothing(value: any) {
        if (value) {
            this._arrayImageDadClothing = value;
        }
    }


    @Input() set arrayImageDadTecnology(value: any) {
        if (value) {
            this._arrayImageDadTecnology = value;
        }
    }

    arraData = [];

    constructor(
        public componentsService: ComponentsService,
        private languageService: TranslateService
    ) { }

    ngOnInit(
    ) { }

    // Funcion para colocar los combos de las imagenes en grupos de 5.
    setImgUrl(dataImage: any) {
        this.urlArrayDad[dataImage[0]] = dataImage[1];
        this.toPpal.emit(this.urlArrayDad);
    }

    /**
     * Arreglo de imagenes para validar URL imagenes repetidas
     * @param {*} data
     * @memberof CompoImagesComponent
     */
    setImgUrlPush(data: any) {
        if (data) {
            this.arraData.forEach(el => {
                if (el === data) {
                    this.componentsService.openSnackBar(this.languageService.instant('secure.products.create_product_unit.image.repeated'), this.languageService.instant('actions.close'), 4000);
                }
            });
        }
        this.imagePush.emit(data);
        this.arraData.push(data);
    }

    /**
     * Delete url null
     * @param {*} val
     * @memberof CompoImagesComponent
     */
    sliceUrlArray(val: any) {
        const deleteUrl = this.arraData.indexOf(val);
        if (deleteUrl > -1) {
            this.arraData.splice(deleteUrl, 1);
            this.urlArrayDad.splice(deleteUrl, 1);
        }
    }
}
