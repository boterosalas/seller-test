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

  constructor(private _formBuilder: FormBuilder, fb: FormBuilder) {
    this.options = fb.group({
      hideRequired: false,
      floatLabel: 'auto',
  });
}

  ngOnInit() {
    this.eanFormGroup = this._formBuilder.group({
      eanCtrl: ['', Validators.required]
    });
    this.categoryFormGroup = this._formBuilder.group({
      categoryCtrl: ['', Validators.required]
    });
    this.basicInfoFormGroup = this._formBuilder.group({
      basicInfoCtrl: ['', Validators.required]
    });
    this.especificFormGroup = this._formBuilder.group({
      especificCtrl: ['', Validators.required]
    });
    this.imageFormGroup = this._formBuilder.group({
      imageCtrl: ['', Validators.required]
    });
  }

}
