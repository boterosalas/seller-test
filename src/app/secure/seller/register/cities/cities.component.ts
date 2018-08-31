import { Component, OnInit, Inject, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { Validators, FormControl, FormGroup, FormGroupDirective, NgForm } from '@angular/forms';
import { CitiesServices } from './cities.service';
import { Cities } from '../models/cities.model';
import { ErrorStateMatcher } from '@angular/material';
import { ShellComponent } from '@core/shell/shell.component';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}


@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  providers: [CitiesServices]
})
export class CitiesComponent implements OnInit, OnChanges {

  public listItems: any;
  public citiesFormControl: FormControl;
  public validateFormRegister: FormGroup;
  public citiesObject: Cities;
  public matcher: MyErrorStateMatcher;
  @Input() idState: number;
  @Output() daneCodeEvent = new EventEmitter<number>();

  constructor(
    @Inject(CitiesServices)
    private dataService: CitiesServices,
    public shellComponent: ShellComponent) {
    this.citiesObject = new Cities();
  }

  /**
   * @method ngOnInit
   * @description Metodo que se ejecuta mientras inicia el componente
   * @memberof CitiesComponent
   */
  ngOnInit() {
    this.validateFormRegister = new FormGroup({
      citiesFormControl: new FormControl({ value: '', disabled: true }, [Validators.required])
    });
    this.matcher = new MyErrorStateMatcher();
  }

  /**
   * @method ngOnInit
   * @description Metodo que se ejecuta cuando se detecta un cambio en algún atributo del componente
   * @memberof CitiesComponent
   */
  ngOnChanges(changes) {
    if (this.idState && this.idState !== undefined && this.idState !== null) {
      this.getCitiesDropdown(this.idState);
      this.daneCodeEvent.emit(null);
    }
  }

  /**
   * @method getCitiesDropdown
   * @param state
   * @description Metodo que consume el servicio que retorna el listado de ciudades
   * @memberof CitiesComponent
   */
  getCitiesDropdown(state) {
    this.shellComponent.loadingComponent.viewLoadingSpinner();
    this.dataService.fetchData(state).subscribe(
      (result: any) => {
        if (result.status === 200) {
          const data_response = JSON.parse(result.body.body);
          const data = data_response.Data;
          this.listItems = data;
          this.validateFormRegister.get('citiesFormControl').enable();
          this.shellComponent.loadingComponent.closeLoadingSpinner();
        } else {
          this.shellComponent.loadingComponent.closeLoadingSpinner();
          this.shellComponent.modalComponent.showModal('errorService');
        }
      }
    );
  }

  /**
   * @method setDataCitie
   * @description Metodo para enviar los datos de la ciudad seleccionada, de aca se usa el codigo dane
   * @param param
   * @memberof CitiesComponent
   */
  setDataCitie(param) {
    this.daneCodeEvent.emit(param);
  }

  /**
   * @method setParamToDaneChange
   * @description Metodo para cargar los dane luego de cambiar de foco en el campo de departamentos
   * @param states
   * @memberof CitiesComponent
   */
  public setParamToDaneChange() {
    const citieId = this.validateFormRegister.get('citiesFormControl').value;
    if (typeof citieId !== 'undefined' && citieId !== '') {
      for (let i = 0; i < this.listItems.length; i++) {
        if (this.listItems[i].Id === citieId) {
          this.daneCodeEvent.emit(this.listItems[i]);
        }
      }
    }
  }
}
