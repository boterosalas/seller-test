import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, NgForm } from '@angular/forms';
import { EanServicesService } from '../validate-ean/ean-services.service';
import { ErrorStateMatcher } from '@angular/material';

@Component({
  selector: 'app-validate-ean',
  templateUrl: './validate-ean.component.html',
  styleUrls: ['./validate-ean.component.scss']
})
export class ValidateEanComponent implements OnInit {
  options: FormGroup;
  eanGroup: FormGroup;
  public infox;
  public formatEan = /^(([a-zA-Z0-9]{7,13})|([0-9]{7,13}))$/;
  // constructor() { }

  // metodo para chekear el chechk box
  constructor(private fb: FormBuilder, private service: EanServicesService) {
  }
  ngOnInit() {
    // metodo para validar el input del form
    this.eanGroup = this.fb.group({
      eanCtrl: ['', Validators.pattern(this.formatEan)],
      associateEan: false,
      floatLabel: 'auto',
    });
  }

  // consumiendo servicio para validar si el EAN es valido
  getEanServices() {
    console.log('this.eanGroup: ', this.eanGroup);
    console.log('this.controls: ', this.eanGroup.controls.eanCtrl.value);
    this.infox = false;
    this.service.validateEan(this.eanGroup.controls.eanCtrl.value).subscribe(res => {
      console.log('res: ', res);
      this.infox = res['data'];
    }, error => {
      this.infox = false;
      console.log('Servicio no funciona');
    });
  }
}
