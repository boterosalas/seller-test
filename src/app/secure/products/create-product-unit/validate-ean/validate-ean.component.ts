import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-validate-ean',
  templateUrl: './validate-ean.component.html',
  styleUrls: ['./validate-ean.component.scss']
})
export class ValidateEanComponent implements OnInit {
  options: FormGroup;

  // constructor() { }

  constructor(fb: FormBuilder) {
    this.options = fb.group({
      hideRequired: false,
      floatLabel: 'auto',
    });
  }

  ngOnInit() {
  }
}
