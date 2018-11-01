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
  eanGroup: FormGroup;
  public validateEanExist;
  // public formatEan = /'(^((IZ)[0-9]{5,11})$|^([0-9]{7,13})$)'/;
  public activeButtonCreacionUnitaria: boolean;
  public asignatedEan: boolean;

  constructor(private fb: FormBuilder, private service: EanServicesService) {
  }
  ngOnInit() {
    // metodo para validar el input del form
    this.eanGroup = this.fb.group({
      eanCtrl: ['', Validators.pattern('(^((IZ)[0-9]{5,11})$|^([0-9]{7,13})$)')],
      asignatedEan: false,
      floatLabel: 'auto'
    });
    this.validateEanExist = true;
  }

  // validar estado de checkbox
  onAsignatedEanChanged(value: boolean) {
    this.asignatedEan = value;
     if (this.asignatedEan === true) {
          this.eanGroup.controls['eanCtrl'].disable();
    } else {
      this.eanGroup.controls['eanCtrl'].enable();
    }
  }

  // Consumiendo servicio para validar si el EAN es valido y si existe en la base de datos
  validateEanServices() {
    this.activeButtonCreacionUnitaria = false;
    if (this.eanGroup.value.eanCtrl.length >= 7 && this.eanGroup.value.eanCtrl.length <= 13) {
      this.service.validateEan(this.eanGroup.controls.eanCtrl.value).subscribe(res => {
        // Validar si la data es un booleano
        this.validateEanExist = (res['data']);
        if (!!(res['data'] === true || !!(res['data'] === false))) {
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

  // Funcion para validar el estado de los campos del formulario para habilitar el boton.
  permitContinue(): boolean {
    return ( !this.activeButtonCreacionUnitaria && !this.asignatedEan ) || (this.activeButtonCreacionUnitaria && this.asignatedEan);
  }

  // Funcion mirar estado del boton continuar
  disabledButtonUnitCreation() {
    this.activeButtonCreacionUnitaria = false;
  }
}
