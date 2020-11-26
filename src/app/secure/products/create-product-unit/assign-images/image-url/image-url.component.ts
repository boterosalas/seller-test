import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { AsignateimageService } from '@app/secure/products/create-product-unit/assign-images/assign-images.component.service';
import { ErrorStateMatcher } from '@angular/material';
import { SupportService } from '@app/secure/support-modal/support.service';

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
  @Input() idParentArray: any;
  @Output() imgUrlOut = new EventEmitter();
  @Output() imgUrlOutPush = new EventEmitter();
  @Output() imgUrlOutPushSlice  = new EventEmitter();

  public valImage: any;
  formatimage: any;
  createImage: FormGroup;
  // public formatImg: any;
  arrayImageDadClothing: any;
  arrayDuplicatedImege: any;
  matrixImagen: any;
  sliceVal: any;
  @Input() set setImag(value: any) {
    if (value) {
      this.sendChange(value);
      this.pushURLImage(value);
      if (this.createImage.controls) {
        this.createImage.controls.inputImage.setValue(value);
      }
    }
  }

  @Input() set setImagTec(value: any) {
    if (value) {
      this.sendChange(value);
      this.pushURLImage(value);
      if (this.createImage && this.createImage.controls) {
        this.createImage.controls.inputImage.setValue(value);
      }
    }
  }

  public formatImg = /^([^\s]+(\.(?:jpg|JPG|png|PNG))$)/;
  imageRegex = { imageProduct: '' };


  constructor(
    private fb: FormBuilder, private service: AsignateimageService,
    public SUPPORT?: SupportService,
  ) {
    this.createImage = this.fb.group({
      inputImage: ['', Validators.pattern(this.formatImg)],
    });
    this.imgUrl = './assets/img/no-image.svg';
  }

  ngOnInit() {
    this.arrayDuplicatedImege = [];
    this.matrixImagen = {};
  }

  createFormControls() {
    this.createImage = this.fb.group({
      inputImage: ['', Validators.pattern(this.imageRegex.imageProduct)],
    });
  }


  /**
   * Funcion sendChange()
   * Funcion para colocar valor de input en el src y cargar la imagen y que sea .jpg
   * @memberof ImageUrlComponent
   */
  sendChange(val: any) {
    this.imgUrl = val;
    if (val.match(this.formatImg)) {
      const dataToSend = {
        UrlImage: val
      };
      this.service.getvalidateImage(dataToSend).subscribe(res => {
        this.formatimage = JSON.parse(res.body);
        if (this.formatimage.Data.Error === false) {
          this.imgUrlOut.emit([this.index, this.imgUrl]);
        } else {
          const resDataError = JSON.parse(this.formatimage.Data);
          if (this.imgUrl) {
            this.createImage.controls.inputImage.setErrors({ 'validFormatImage': resDataError.Error });
          }
          this.imgUrl = './assets/img/no-image.svg';
        }
      });
    } else {
      this.imgUrl = './assets/img/no-image.svg';
      this.imgUrlOut.emit([this.index, '']);
    }
  }

  /**
   * Emit url image
   * @param {*} val
   * @memberof ImageUrlComponent
   */
  pushURLImage(val: any) {
    if (val) {
      this.sliceVal = val;
      this.imgUrlOutPush.emit(val);
    } else {
      this.imgUrlOutPushSlice.emit(this.sliceVal);
    }
  }
}





