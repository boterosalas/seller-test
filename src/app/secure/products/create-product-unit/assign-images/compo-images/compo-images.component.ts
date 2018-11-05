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

    setImgUrl(dataImage: any) {
        console.log(dataImage);
        this.urlArrayDad[dataImage[0]] = dataImage[1];
        console.log(this.urlArrayDad);
        this.toPpal.emit(this.urlArrayDad);
      }
}
