import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

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
@Input() set arrayImageDadClothing (value: any){
    console.log(44, this.arrayImageDadClothing);
    if (value) {
        this._arrayImageDadClothing = value;
    }
}


@Input() set arrayImageDadTecnology(value: any){
    if (value) {
        this._arrayImageDadTecnology = value;
    }
}

constructor() {
    }

    ngOnInit(
    ) {
        console.log('hijosArrTmp: ', this.hijosArrTmp);
    }
    // Funcion para colocar los combos de las imagenes en grupos de 5.
    setImgUrl(dataImage: any) {
        console.log(66, dataImage);
        this.urlArrayDad[dataImage[0]] = dataImage[1];
        this.toPpal.emit(this.urlArrayDad);
      }
}
