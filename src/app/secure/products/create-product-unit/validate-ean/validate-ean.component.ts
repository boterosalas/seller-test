import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-validate-ean',
  templateUrl: './validate-ean.component.html',
  styleUrls: ['./validate-ean.component.scss']
})
export class ValidateEanComponent implements OnInit {
  validateFormEan: any;

  constructor() { }

  ngOnInit() {
  this.validateFormEan = new FormGroup({
    Ean: new FormControl('', [
      Validators.maxLength(13),
      Validators.minLength(7),
      Validators.pattern('^[0-9A-Z Á É Í Ó Ú Ü Ñ  À È Ù Ë Ï Ü Â Ê Î Ô Û Ç]*$')
    ]),
    CheckEan: new FormControl
      ('', [
      Validators.maxLength(20),
      Validators.pattern('^[0-9]*$')
      ])
    }
}
