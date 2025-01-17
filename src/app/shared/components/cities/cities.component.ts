import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';

import { LoadingService, ModalService } from '@app/core';

import { Cities } from './cities.model';
import { CitiesServices } from './cities.service';


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
  @Input() elementLoad: string;
  @Input() disabledComponent: boolean;

  constructor(
    @Inject(CitiesServices)
    private dataService: CitiesServices,
    private loadingService: LoadingService,
    private modalService: ModalService
  ) {
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
  ngOnChanges(changes: any) {
    if (this.idState && this.idState !== undefined && this.idState !== null) {
      this.getCitiesDropdown(this.idState);
      this.daneCodeEvent.emit(null);
    }
  }

  /**
   * Recibe una cadena de palabras y procede a buscar en la lista de departamentos, para obtener el Identificador
   * para asi cargarlo en front
   * @param {*} element
   * @returns {number}
   * @memberof StatesComponent
   */
  public validateElementLoaded(element: string): any {
    let loaded: any;
    this.listItems.forEach(item => {
      if (item.Name === element) {
        loaded = item;
      }
    });
    return loaded;
  }

  /**
   * @method getCitiesDropdown
   * @param state
   * @description Metodo que consume el servicio que retorna el listado de ciudades
   * @memberof CitiesComponent
   */
  getCitiesDropdown(state: any) {
    this.loadingService.viewSpinner();
    this.dataService.fetchData(state).subscribe(
      (result: any) => {
        if (result.status === 200) {
          const data_response = JSON.parse(result.body.body);
          const data = data_response.Data;
          this.listItems = data;
          if (!this.disabledComponent) {
            this.validateFormRegister.get('citiesFormControl').enable();
          }
          this.loadingService.closeSpinner();
          if (this.elementLoad) {
            const citySelected = this.validateElementLoaded(this.elementLoad);
            if (citySelected) {
              this.validateFormRegister.controls['citiesFormControl'].setValue(citySelected.Id, { onlySelf: true });
            }
          }
        } else {
          this.loadingService.closeSpinner();
          this.modalService.showModal('errorService');
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
  setDataCitie(param: any) {
    this.daneCodeEvent.emit(param);
  }

  /**
   * @method setParamToDaneChange
   * @description Metodo para cargar los dane luego de cambiar de foco en el campo de departamentos
   * @memberof CitiesComponent
   * @param cities
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
