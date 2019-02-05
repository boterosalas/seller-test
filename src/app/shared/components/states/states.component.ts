import { Component, EventEmitter, Inject, OnInit, Output, Input } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { LoadingService, ModalService } from '@app/core';

import { State } from './states.model';
import { StatesService } from './states.service';


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-states-data',
  templateUrl: './states.component.html',
  providers: [StatesService]
})

export class StatesComponent implements OnInit {

  public listItems: any;
  public statesFormControl: FormControl;
  public validateFormRegister: FormGroup;
  public statesObject: State;
  public matcher: MyErrorStateMatcher;
  @Output() idStateEvent = new EventEmitter<number>();
  @Input() elementLoad: any;
  @Input() disabledComponent: boolean;

  constructor(
    @Inject(StatesService)
    private dataService: StatesService,
    private loadingService: LoadingService,
    private modalService: ModalService
  ) {
    this.statesObject = new State();
  }

  /**
   * @method ngOnInit
   * @description Método que se ejecuta mientras inicia el componente
   * @memberof StatesComponent
   */
  ngOnInit() {
    this.validateFormRegister = new FormGroup({
      statesFormControl: new FormControl({value: '', disabled: this.disabledComponent}, [Validators.required])
    });
    this.matcher = new MyErrorStateMatcher();

    this.getStatesDropdown();
  }

  /**
   * Recibe una cadena de palabras y procede a buscar en la lista de departamentos, para obtener el Identificador
   * para asi cargarlo en front
   * @param {*} element
   * @returns {number}
   * @memberof StatesComponent
   */
  public validateElementLoaded(element: string): number {
    let idLoad: number;
    this.listItems.forEach(item => {
      if (item.Name === element) {
        idLoad = item.Id;
      }
    });
    return idLoad;
  }

  /**
   * @method getStatesDropdown
   * @description Metodo para consumir el servicio que retorna el listado de departamentos
   * @memberof StatesComponent
   */
  getStatesDropdown() {
    this.loadingService.viewSpinner();
    this.dataService.fetchData().subscribe(
      (result: any) => {
        if (result.status === 200) {
          const data_response = JSON.parse(result.body.body);
          const data = data_response.Data;
          this.listItems = data;
          this.loadingService.closeSpinner();
          if (this.elementLoad) {
            this.validateFormRegister.controls['statesFormControl'].setValue(this.validateElementLoaded(this.elementLoad), {onlySelf: true});
            this.setParamToCitiesChange();
          }
        } else {
          this.loadingService.closeSpinner();
          this.modalService.showModal('errorService');
        }
      }
    );
  }

  /**
   * @method setParamToCities
   * @param param
   * @description Metodo para enviar el id del estado que se necesita para consumir el servicio de ciudades
   * @memberof StatesComponent
   */
  setParamToCities(param: any) {
    this.idStateEvent.emit(param);
  }

  /**
   * @method setParamToCitiesChange
   * @description Metodo para cargar las ciudades luego de cambiar de foco en el campo de departamentos
   * @memberof StatesComponent
   */
  public setParamToCitiesChange() {
    const stateId = this.validateFormRegister.get('statesFormControl').value;
    if (typeof stateId !== 'undefined' && stateId !== '') {
      for (let i = 0; i < this.listItems.length; i++) {
        if (this.listItems[i].Id === stateId) {
          this.idStateEvent.emit(this.listItems[i]);
        }
      }
    }
  }
}
