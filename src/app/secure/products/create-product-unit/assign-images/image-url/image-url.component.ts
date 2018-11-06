import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AsignateimageService } from '@app/secure/products/create-product-unit/assign-images/assign-images.component.service';


@Component({
    selector: 'app-image-url',
    templateUrl: './image-url.component.html',
    styleUrls: ['./image-url.component.scss']
})

export class ImageUrlComponent implements OnInit {
  @Input() imgUrl: String ;
  @Input() index: String ;
  @Output() imgUrlOut = new EventEmitter();

    constructor(private fb: FormBuilder, private service: AsignateimageService) {
    }

    ngOnInit() {
      /*
        this.createImage = this.fb.group({
            imageDad: ['', Validators.required],
          }); */
    }
    // Funcion para colocar valor de input en el src y cargar la imagen.
    sendChange(val: any) {
      this.imgUrl = val;
      console.log('combo:imgUrl', this.imgUrl);
      this.imgUrlOut.emit([this.index, this.imgUrl]);
    }

    /*
    validateFormatImage() {
        const formatImg = /^([^\s]+(\.jpg)$)/;
        if (this.createImage.controls.imageDad.value.match(formatImg)) {
          console.log('la imagen cumple con el formato.');
          console.log('input value: ', this.createImage.controls.imageDad.value);
          this.service.getvalidateImage(this.createImage.controls.imageDad.value).subscribe(res => {
            // console.log('res', res);
            // console.log('result: ', this.imageValidae);
            this.valueImagenDad = this.createImage.controls.imageDad.value;
          });
        } else {
          console.log('La imagen no es valida');
        }
      }*/
}





