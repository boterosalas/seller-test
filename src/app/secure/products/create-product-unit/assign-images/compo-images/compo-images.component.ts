import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-compo-images',
    templateUrl: './compo-images.component.html',
    styleUrls: ['./compo-images.component.scss']
})

export class CompoImagesComponent implements OnInit {
public urlArrayDad: any = ['', '', '', '', ''];
@Output() toPpal = new EventEmitter();
constructor() {
    }

    ngOnInit() {
    }
    // Funcion para colocar los combos de las imagenes en grupos de 5.
    setImgUrl(dataImage: any) {
        this.urlArrayDad[dataImage[0]] = dataImage[1];
        this.toPpal.emit(this.urlArrayDad);
      }
}
