import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, NgForm } from '@angular/forms';
import { EanServicesService } from '../validate-ean/ean-services.service';
import { ErrorStateMatcher } from '@angular/material';
import { ProcessService } from '../component-process/component-process.service';

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
  public formatEan = /^(([a-zA-Z0-9]{7,13})|([0-9]{7,13}))$/;
  public activeButtonCreacionUnitaria: boolean;
  public asignatedEan: boolean;
  public showButton = false; // Variable que se conecta con el servicio que habilita los botonoes

  constructor(private fb: FormBuilder, private service: EanServicesService, private process: ProcessService) {
  }
  ngOnInit() {
    // metodo para validar el input del form
    this.eanGroup = this.fb.group({
      eanCtrl: ['', Validators.pattern(this.formatEan)],
      associateEan: false,
      floatLabel: 'auto'
    });
    this.validateEanExist = true;
    this.process.change.subscribe(data => {
      this.showButton = data.showEan;
    });
  }

  // validar estado de checkbox
  onAsignatedEanChanged(value: boolean) {
    this.asignatedEan = value;
     if (this.asignatedEan === true) {
      this.sendEan();
      this.eanGroup.controls['eanCtrl'].disable();
      if (!this.eanGroup.controls.eanCtrl.value) {
        const data = {
          AssignEan: this.asignatedEan
        };
        this.process.validaData(data);
      } else {
        this.process.unavailableEanView();
      }
    } else {
      if (!this.eanGroup.controls.eanCtrl.value && !value) {
        this.process.unavailableEanView();
      } else {
        this.sendEan();
      }
      this.eanGroup.controls['eanCtrl'].enable();
    }
  }

  public sendEan(): void {
    const data = {
      Ean: this.eanGroup.controls.eanCtrl.value,
      HasEan: this.eanGroup.controls.associateEan.value,
      AssignEan: this.eanGroup.controls.associateEan.value,
    };
    this.process.validaData(data);

  }

  // Consumiendo servicio para validar si el EAN es valido y si existe en la base de datos
  validateEanServices() {
    this.activeButtonCreacionUnitaria = false;
    if (this.eanGroup.value.eanCtrl.length >= 7 && this.eanGroup.value.eanCtrl.length <= 13) {
      this.service.validateEan(this.eanGroup.controls.eanCtrl.value).subscribe(res => {
        // Validar si la data es un booleano
        this.validateEanExist = (res['data']);
        if (this.validateEanExist) {
          this.eanGroup.controls.eanCtrl.setErrors({ 'validExistEanDB': this.validateEanExist });
          this.process.unavailableEanView();
        }
        if (!this.validateEanExist) {
          this.activeButtonCreacionUnitaria = true;
          this.sendEan();
        }
      }, error => {
        // this.validateEanExist = true;
      });
    } else {
      this.process.unavailableEanView();
    }
  }

  // Funcion para validar el estado de los campos del formulario para habilitar el boton.
  permitContinue(): boolean {
    return !this.showButton;
  }

  // Funcion mirar estado del boton continuar
  disabledButtonUnitCreation() {
    this.activeButtonCreacionUnitaria = false;
  }
}
