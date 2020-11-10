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
  public valImage: any;
  formatimage: any;
  createImage: FormGroup;
  public formatImg = /^([^\s]+(\.(?:jpg|JPG|png|PNG))$)/;
  arrayImageDadClothing: any;
  arrayDuplicatedImege: any;
  matrixImagen: any;
  @Input() set setImag(value: any) {
    if (value) {
      this.sendChange(value);
      if (this.createImage && this.createImage.controls) {
        this.createImage.controls.inputImage.setValue(value);
      }
    }
  }

  @Input() set setImagTec(value: any) {
    if (value) {
      this.sendChange(value);
      if (this.createImage && this.createImage.controls) {
        this.createImage.controls.inputImage.setValue(value);
      }
    }
  }

  imageRegex = { imageProduct: '' };


  constructor(
    private fb: FormBuilder, private service: AsignateimageService,
    public SUPPORT?: SupportService,
  ) {
    this.validateFormSupport();
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
            this.createImage.controls.inputImage.setErrors({ 'validFormatImage': resDataError.Error });
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
    this.imgUrlOutPush.emit(val);
  }

  public validateFormSupport(): void {
    this.SUPPORT.getRegexFormSupport(null).subscribe(res => {
      let dataOffertRegex = JSON.parse(res.body.body);
      dataOffertRegex = dataOffertRegex.Data.filter(data => data.Module === 'productos');
      for (const val in this.imageRegex) {
        if (!!val) {
          const element = dataOffertRegex.find(regex => regex.Identifier === val.toString());
          this.imageRegex[val] = element && `${element.Value}`;
        }
      }
      this.createFormControls();
    });
  }
}





