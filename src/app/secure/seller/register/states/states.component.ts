import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
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

  public listItems: {};
  public statesFormControl: FormControl;
  public validateFormRegister: FormGroup;
  public statesObject: State;
  public matcher: MyErrorStateMatcher;
  @Output() idStateEvent = new EventEmitter<number>();

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
      statesFormControl: new FormControl('', [Validators.required])
    });
    this.matcher = new MyErrorStateMatcher();

    this.getStatesDropdown();
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
   * @param states
   * @memberof StatesComponent
   */
  public setParamToCitiesChange(states: any) {
    const statesId = states.statesObject.Name;
    if (typeof statesId !== 'undefined' && statesId !== '') {
      for (let i = 0; i < states.listItems.length; i++) {
        if (states.listItems[i].Id === statesId) {
          this.idStateEvent.emit(states.listItems[i]);
        }
      }
    }
  }
}
