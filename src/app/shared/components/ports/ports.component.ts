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
  public listPorts: PortEntity;
  @Output() portItemEmmited = new EventEmitter<number>();
  @Input() disabledComponent: boolean;

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
    this.getPortsDropdown();
  }

  /**
   * @method ngOnInit
   * @description Metodo que se ejecuta cuando se detecta un cambio en algún atributo del componente
   * @memberof CitiesComponent
   */
  ngOnChanges(changes: any) {
    // if (this.idState && this.idState !== undefined && this.idState !== null) {
      this.getPortsDropdown();
      this.portItemEmmited.emit(null);
    // }
  }
  getPortsDropdown() {
    this.loadingService.viewSpinner();
    this.portService.fetchData().subscribe(
      (data: any) => {
        // console.log(data);
        this.listPorts = data;
        if (!this.disabledComponent) {
          this.validateFormRegister.get('portsFormControl').enable();
        }
        this.loadingService.closeSpinner();
      },
      err => console.log(err)
    )
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
