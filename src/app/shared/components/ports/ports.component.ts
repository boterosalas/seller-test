import { Component, OnInit, Output, EventEmitter, Inject, OnChanges, Input } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material';
import { FormControl, FormGroupDirective, NgForm, FormGroup, Validators } from '@angular/forms';
import { PortsService } from './ports.service';
import { PortEntity } from '@app/shared';
import { LoadingService, ModalService } from '@app/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-ports',
  templateUrl: './ports.component.html',
  providers: [PortsService]
})
export class PortsComponent implements OnInit, OnChanges {
  public portsFormControl: FormControl;
  public validateFormRegister: FormGroup;
  public matcher: MyErrorStateMatcher;
  public listPorts: PortEntity[] = [];
  @Output() portItemEmmited = new EventEmitter<number>();
  @Input() disabledComponent: boolean;
  @Input() elementLoad: number;
  @Input() countryName: string;

  constructor(
    @Inject(PortsService)
    private portService: PortsService,
    private loadingService: LoadingService,
    private modalService: ModalService
  ) { }

  ngOnInit() {
    this.validateFormRegister = new FormGroup({
      portsFormControl: new FormControl({ value: '', disabled: true }, [Validators.required])
    });
    this.matcher = new MyErrorStateMatcher();
  }

  /**
   * @method ngOnInit
   * @description Metodo que se ejecuta cuando se detecta un cambio en algún atributo del componente
   * @memberof CitiesComponent
   */
  ngOnChanges(changes: any) {
    console.log(this.countryName);
    if (this.countryName && this.countryName !== undefined && this.countryName !== null) {
      this.getPortsDropdown(this.countryName);
      this.portItemEmmited.emit(null);
    }
  }

  /**
   * Recibe una cadena de palabras y procede a buscar en la lista de departamentos, para obtener el Identificador
   * para asi cargarlo en front
   * @param {*} element
   * @returns {number}
   * @memberof StatesComponent
   */
  public validateElementLoaded(element: number): any {
    let loaded: any;
    this.listPorts.forEach(port => {
      if (port.Id === element) {
        loaded = port;
      }
    });
    return loaded;
  }

  getPortsDropdown(countryName: string) {
    this.loadingService.viewSpinner();
    this.portService.getPortByCountryName(countryName.toUpperCase()).subscribe(
      (data: PortEntity[]) => {
        this.listPorts = data;
        if (!this.disabledComponent) {
          this.validateFormRegister.get('portsFormControl').enable();
        }
        if (this.elementLoad) {
          console.log(this.elementLoad)
          const portSelected = this.validateElementLoaded(this.elementLoad);
          // console.log(portSelected);
          if (portSelected) {
            this.validateFormRegister.controls['portsFormControl'].setValue(portSelected.Id, { onlySelf: true });
          }
        }
        this.loadingService.closeSpinner();
      },
      err => {
        this.loadingService.closeSpinner();
        this.modalService.showModal('errorService');
      }
    );
  }

  /**
     * @method setDataPort
     * @description Metodo para enviar los datos de la ciudad seleccionada, de aca se usa el codigo dane
     * @param param
     * @memberof PortsComponent
     */
  setDataPort(param: any) {
    this.portItemEmmited.emit(param);
  }
}
