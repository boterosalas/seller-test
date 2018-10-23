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
    this.validateEanExist = false;
    this.service.validateEan(this.eanGroup.controls.eanCtrl.value).subscribe(res => {
      this.validateEanExist = !res['data'];
      if ( !this.validateEanExist ) {
        this.eanGroup.controls.eanCtrl.setErrors({ 'validExistEanDB': !this.validateEanExist});
      }
    }, error => {
      this.validateEanExist = true;
      console.log('Servicio no funciona');
    });
  }
}
