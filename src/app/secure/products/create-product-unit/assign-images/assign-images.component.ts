import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-assign-images',
  templateUrl: './assign-images.component.html',
  styleUrls: ['./assign-images.component.scss']
})
export class AssignImagesComponent implements OnInit {
  createImage: FormGroup;
  public netImage: any;
  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.createImage = this.fb.group({
      imageDad: ['', Validators.required],
    });
    console.log('input: ', this.createImage.controls.imageDad);
    this.asignarImageDiv();
  }

  asignarImageDiv() {
    this.netImage = this.createImage.controls['imageDad'].value;
    console.log('input: cargado', this.createImage.controls.imageDad);
  }
}
