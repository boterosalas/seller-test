import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators } from '@angular/forms';

@Component({
  selector: 'app-component-process',
  templateUrl: './component-process.component.html',
  styleUrls: ['./component-process.component.scss']
})
export class ComponentProcessComponent implements OnInit {
   isLinear = false;
  /* eanCtrl: FormGroup;
  categoryCtrl: FormGroup;
  basicInfoCtrl: FormGroup;
  especificCtrl: FormGroup;
  imageCtrl: FormGroup; */
  eanFormGroup: FormGroup;
  categoryFormGroup: FormGroup;
  basicInfoFormGroup: FormGroup;
  especificFormGroup: FormGroup;
  imageFormGroup: FormGroup;
  options: FormGroup;

  constructor(private fb: FormBuilder) {
    this.options = fb.group({
      hideRequired: false,
      floatLabel: 'auto',
  });
}

  ngOnInit() {
    this.eanFormGroup = this.fb.group({
      eanCtrl: ['', Validators.required]
    });
    this.categoryFormGroup = this.fb.group({
      categoryCtrl: ['', Validators.required]
    });
    this.basicInfoFormGroup = this.fb.group({
      basicInfoCtrl: ['', Validators.required]
    });
    this.especificFormGroup = this.fb.group({
      especificCtrl: ['', Validators.required]
    });
    this.imageFormGroup = this.fb.group({
      imageCtrl: ['', Validators.required]
    });
  }

}
