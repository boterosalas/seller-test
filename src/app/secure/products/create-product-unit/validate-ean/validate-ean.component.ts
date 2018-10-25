import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, NgForm } from '@angular/forms';
import { EanServicesService } from '../validate-ean/ean-services.service';
import { ErrorStateMatcher } from '@angular/material';

// Error when invalid control is dirty, touched, or submitted.
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-validate-ean',
  templateUrl: './validate-ean.component.html',
  styleUrls: ['./validate-ean.component.scss']
})
export class ValidateEanComponent implements OnInit {
  options: FormGroup;
  public response: any;
  eanGroup: FormGroup;
  public validateEanExist;
  public formatEan = /^(([a-zA-Z0-9]{7,13})|([0-9]{7,13}))$/;
  public activeButtonCreacionUnitaria: boolean;
  // constructor() { }

  // metodo para chekear el chechk box
  constructor(private fb: FormBuilder, private service: EanServicesService) {
  }
  ngOnInit() {
    // metodo para validar el input del form
    console.log('validateEanExist: ', this.validateEanExist);
    this.eanGroup = this.fb.group({
      eanCtrl: ['', Validators.pattern(this.formatEan)],
      associateEan: false,
      floatLabel: 'auto'
    });
    this.validateEanExist = true;
    console.log('this.validateEanExist: ', this.eanGroup.controls.eanCtrl.value);
  }

  // consumiendo servicio para validar si el EAN es valido
  validateEanServices(validateEanExist: any) {
    this.activeButtonCreacionUnitaria = false;
    console.log('input: ', this.eanGroup.value.eanCtrl);
    if (this.eanGroup.value.eanCtrl.length >= 7 && this.eanGroup.value.eanCtrl.length <= 13) {
      console.log('this.eanGroup.value.eanCtrl: ', this.eanGroup.value.eanCtrl.length);
      this.service.validateEan(this.eanGroup.controls.eanCtrl.value).subscribe(res => {
        // Validar si la data es un booleano
        this.validateEanExist = (res['data']);
        if (!!(res['data'] === true || !!(res['data'] === false))) {
          console.log('validateEanExist 2: ', this.validateEanExist);
          // throw new Error('Data not valid');
        }
        if (this.validateEanExist) {
          this.eanGroup.controls.eanCtrl.setErrors({ 'validExistEanDB': this.validateEanExist });
        }
        if (!this.validateEanExist) {
          this.activeButtonCreacionUnitaria = true;
        }
      }, error => {
        // this.validateEanExist = true;
        console.log('Servicio no funciona');
      });
    } else {
      console.log('Campo invalido');
    }
  }

  /**
   * Metodo para deshabiliar boton continuar
   * disabledButtonUnitCreation
   */

  disabledButtonUnitCreation() {
    this.activeButtonCreacionUnitaria = false;
  }
}
