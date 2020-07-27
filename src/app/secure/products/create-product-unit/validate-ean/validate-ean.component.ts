import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, NgForm } from '@angular/forms';
import { EanServicesService } from '../validate-ean/ean-services.service';
import { ErrorStateMatcher } from '@angular/material';
import { ProcessService } from '../component-process/component-process.service';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { CommonService } from '@app/shared';

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
export class ValidateEanComponent {
  options: FormGroup;
  eanGroup: FormGroup;
  public validateEanExist;
  public formatEan;
  public activeButtonCreacionUnitaria: boolean;
  public asignatedEan: boolean;
  public showButton = false; // Variable que se conecta con el servicio que habilita los botonoes
  public copy = null;
  @Input() ean: any;
  @Input() reference: any;
  public productEdit = false;

  constructor(private fb: FormBuilder, private service: EanServicesService, private process: ProcessService,
    private commonService: CommonService) {
      this.getRegex();
  }

  getRegex() {
    this.commonService.getAllRegex().subscribe(result => {
      if (result.status === 200) {
        const regex  = JSON.parse(result.body.body).Data;
        this.formatEan = regex.find(reg => reg.Identifier === 'ean').Value;
        this.initForm();
      }
    });
  }

  initForm() {
    // metodo para validar el input del form
    this.eanGroup = this.fb.group({
      eanCtrl: ['', Validators.compose([Validators.pattern(this.formatEan)])],
      associateEan: false,
      floatLabel: 'auto'
    });
    this.eanGroup.get('eanCtrl').valueChanges.pipe(distinctUntilChanged(), debounceTime(500)).subscribe(val => {
      if (!!val && !!this.eanGroup.valid) {
        this.validateEanServices();
      }
    });
    this.validateEanExist = true;
    if (this.ean) {
      this.eanGroup.controls.eanCtrl.setValue(this.ean.toString());
      this.productEdit = true;
    } else {
      this.process.views = {
        showEan: false,
        showCat: false,
        showInfo: false,
        showSpec: false,
        showImg: false,
      };
    }
    this.process.change.subscribe(data => {
      this.showButton = data.showEan;
    });
  }

  // validar estado de checkbox
  onAsignatedEanChanged(value: boolean) {
    this.asignatedEan = value;
    if (this.asignatedEan === true) {
      this.sendEan();
      this.eanGroup.controls['eanCtrl'].setValue('');
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
      ParentReference: this.reference
    };
    this.process.validaData(data);

  }

  // Consumiendo servicio para validar si el EAN es valido y si existe en la base de datos
  validateEanServices() {
    this.activeButtonCreacionUnitaria = false;
    if (this.eanGroup.value.eanCtrl.match(this.formatEan)) {
      this.service.validateEan(this.eanGroup.controls.eanCtrl.value).subscribe(res => {
        // Validar si la data es un booleano
        this.validateEanExist = (res['data']);
        if (this.validateEanExist) {
          if (this.productEdit) {
            this.activeButtonCreacionUnitaria = true;
            this.sendEan();
          } else {
            this.eanGroup.controls.eanCtrl.setErrors({ 'validExistEanDB': this.validateEanExist });
            this.process.unavailableEanView();
          }
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
