import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { AsignateimageService } from '@app/secure/products/create-product-unit/assign-images/assign-images.component.service';
import { ErrorStateMatcher } from '@angular/material';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-image-url',
  templateUrl: './image-url.component.html',
  styleUrls: ['./image-url.component.scss']
})

export class ImageUrlComponent implements OnInit {
  @Input() imgUrl: String;
  @Input() index: String;
  @Output() imgUrlOut = new EventEmitter();
  public valImage: any;
  formatimage: any;
  createImage: FormGroup;
  public formatImg = /^([^\s]+(\.jpg)$)/;

  constructor(private fb: FormBuilder, private service: AsignateimageService) {
  }

  ngOnInit() {
      this.createImage = this.fb.group({
          inputImage: ['', Validators.pattern(this.formatImg)],
        });
        this.imgUrl = 'novalido.jpg';
  }
  // Funcion para colocar valor de input en el src y cargar la imagen.
  /*  sendChange(val: any) {
      this.imgUrl = val;
      console.log('combo:imgUrl', this.imgUrl);
      this.imgUrlOut.emit([this.index, this.imgUrl]);
    } */

  // Funcion para colocar valor de input en el src y cargar la imagen y que sea .jpg
  sendChange(val: any) {
    this.imgUrl = val;
    if (val.match(this.formatImg)) {
      this.valImage = this.imgUrl.replace(new RegExp('/', 'g'), '%2F');
      this.service.getvalidateImage(this.valImage).subscribe(res => {
        this.formatimage = JSON.parse(res.body);
        if (this.formatimage.Data.Error === false) {
          this.imgUrlOut.emit([this.index, this.imgUrl]);
        } else {
          if ( this.imgUrl ) {
            this.createImage.controls.inputImage.setErrors({ 'validFormatImage': this.formatimage.Data.Error});
            this.imgUrl = 'novalido.jpg';
          }
        }
      });
    } else {
      this.imgUrl = 'novalido.jpg';
    }
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





