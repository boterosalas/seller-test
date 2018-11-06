import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AsignateimageService } from '../assign-images/assign-images.component.service';

@Component({
  selector: 'app-assign-images',
  templateUrl: './assign-images.component.html',
  styleUrls: ['./assign-images.component.scss']
})
export class AssignImagesComponent implements OnInit {
  public hijos_size: any = 2;  // cantidad de hijos dependiendo a los ingresados en informacion basica.
  public hijosArrTmp  = new Array(this.hijos_size); // Temporal para que no se vallan seteando los hijos al momento de colocar la imagen y poderlos guardar al final
  public parent_image_url_arrray: any = []; // Array principal de fotos
  public children_image_url_arrray: any = []; // Array de fotos de los hijos.

  constructor(private fb: FormBuilder, private service: AsignateimageService) {
  }

  ngOnInit() {
    // Se hace un ciclo para que se vallan llenando los hijos dependiendo a la cantidad creada.
    for (let i = 0; i < this.hijos_size; i++) {
      this.children_image_url_arrray.push(['', '', '', '', '']);
    }
  }

  setParentArray(dataParenArr: any) {
    this.parent_image_url_arrray = dataParenArr;
    console.log('AppComponent::setParentArray', this.parent_image_url_arrray);
  }

  setChildrenArray(dataChildArr: any, i: any) {
    this.children_image_url_arrray[i] = dataChildArr;
    console.log('AppComponent::setChildrenArray', this.children_image_url_arrray);
  }
}
