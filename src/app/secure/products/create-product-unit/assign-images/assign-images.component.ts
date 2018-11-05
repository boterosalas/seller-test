import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AsignateimageService } from '../assign-images/assign-images.component.service';

@Component({
  selector: 'app-assign-images',
  templateUrl: './assign-images.component.html',
  styleUrls: ['./assign-images.component.scss']
})
export class AssignImagesComponent implements OnInit {
  public hijos_size: any = 4;  // cantidad de hijos dependiendo a los ingresados en informacion basica.
  public hijosArrTmp  = new Array(this.hijos_size);
  public parent_image_url_arrray: any = [];
  public children_image_url_arrray: any = [];

  constructor(private fb: FormBuilder, private service: AsignateimageService) {
  }

  ngOnInit() {
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
