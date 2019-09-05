import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AsignateimageService } from '../assign-images/assign-images.component.service';
import { ProcessService } from '../component-process/component-process.service';

@Component({
  selector: 'app-assign-images',
  templateUrl: './assign-images.component.html',
  styleUrls: ['./assign-images.component.scss']
})
export class AssignImagesComponent implements OnInit, OnChanges {
  @Input() children: any;
  public hijos_size: any;  // cantidad de hijos dependiendo a los ingresados en informacion basica.
  public hijosArrTmp = new Array(); // Temporal para que no se vallan seteando los hijos al momento de colocar la imagen y poderlos guardar al final
  public parent_image_url_arrray: any = []; // Array principal de fotos
  public children_image_url_arrray: any = []; // Array de fotos de los hijos.
  cantidadHijos: any;
  _detailProduct: any;
  @Input() set detailProduct(value: any) {
    if (value) {
        this._detailProduct = value;
        console.log(value);
    }
}

  constructor(private fb: FormBuilder, private service: AsignateimageService, private serviceChildrens: ProcessService) {
  }


  ngOnInit() {
    // Se hace un ciclo para que se vallan llenando los hijos dependiendo a la cantidad creada.
    /*for (let i = 0; i < this.cantidadHijos; i++) {
      this.children_image_url_arrray.push(['', '', '', '', '']);
    }*/
  }

  ngOnChanges(): void {
    this.hijosArrTmp = new Array(this.children);
    // Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    // Add '${implements OnChanges}' to the class.
    for (let i = 0; i < this.children; i++) {
      this.children_image_url_arrray.push(['', '', '', '', '']);
    }
  }

  setParentArray(dataParenArr: any) {
    this.parent_image_url_arrray = dataParenArr;
    const data = {
      parent_image_url_arrray: this.parent_image_url_arrray
    };
    this.serviceChildrens.validaData(data);
  }

  setChildrenArray(dataChildArr: any, i: any) {
    /*if (this.cantidadHijos !== 0) {
    // tslint:disable-next-line:no-shadowed-variable
      for (let i = 0; i <= this.cantidadHijos; i++) {
        this.children_image_url_arrray.push(['', '', '', '', '']);
      }
    } */
    this.children_image_url_arrray[i] = dataChildArr;
    const data = {
      children_image_url_arrray: this.children_image_url_arrray
    };
    this.serviceChildrens.validaData(data);
  }

  getChildrensInfoBasic() {
    this.cantidadHijos = this.serviceChildrens.getProductData().Children;
  }
}
