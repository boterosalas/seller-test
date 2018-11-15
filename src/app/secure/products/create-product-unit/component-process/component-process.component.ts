import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators } from '@angular/forms';
import { ProcessService } from './component-process.service';

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
  isOptional = false;
  views: any;
  children_created: any = 0;

  constructor(private fb: FormBuilder,
    private process: ProcessService) {
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
      especificCtrl: ['1', Validators.required]
    });
    this.imageFormGroup = this.fb.group({
      imageCtrl: ['', Validators.required]
    });
    this.process.change.subscribe(data => {
      this.views = data;
      this.validateView();
    });
  }

  private continue_after_basic_info() {
    this.children_created = this.process.getProductData().Children.length;
  }


  public validateView(): void {
    if (this.views.showEan) {
      this.eanFormGroup.controls.eanCtrl.setValue('1');
    } else if (!this.views.showEan) {
      this.eanFormGroup.controls.eanCtrl.setValue(null);
    }
    if (this.views.showCat) {
      this.categoryFormGroup.controls.categoryCtrl.setValue('1');
    }
    if (this.views.showInfo) {
      this.basicInfoFormGroup.controls.basicInfoCtrl.setValue('1');
    } else if (!this.views.showInfo) {
      this.basicInfoFormGroup.controls.basicInfoCtrl.setValue(null);
    }
    if (this.views.showImg) {
      this.imageFormGroup.controls.imageCtrl.setValue('1');
    } else if (!this.views.showImg) {
      this.imageFormGroup.controls.imageCtrl.setValue(null);
    }

  }
}
