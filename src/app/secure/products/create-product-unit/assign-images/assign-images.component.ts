import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AsignateimageService } from '../assign-images/assign-images.component.service';

@Component({
  selector: 'app-assign-images',
  templateUrl: './assign-images.component.html',
  styleUrls: ['./assign-images.component.scss']
})
export class AssignImagesComponent implements OnInit {
  createImage: FormGroup;
  public netImage: any;
  public formatImg: any;
  public result: any;
  public imageValidae;
  valueImagenDad: any;
  constructor(private fb: FormBuilder, private service: AsignateimageService) {
  }

  ngOnInit() {
    this.createImage = this.fb.group({
      imageDad: ['', Validators.required],
    });
  }

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
  }
}


  // this.createImage.controls.imageDad.setErrors({ 'validFormatImage': this.validateimage });
