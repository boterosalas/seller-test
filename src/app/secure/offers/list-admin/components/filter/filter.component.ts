// 3rd party components
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
// our own custom components
import { ModelFilter } from './filter.model';
// import { ListAdminAdminComponent } from '@app/secure/offers/listAdmin-admin/listAdmin-admin/listAdminAdmin.component';
import { ListAdminComponent } from '@app/secure/offers/list-admin/list-admin/list-admin.component';


/**
 * @export
 * @class FilterComponent
 * @implements {OnInit}
 * @implements {OnChanges}
 */
@Component({
  selector: 'app-listAdmin-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})

export class FilterComponent implements OnInit {

  /**
   * Variable que se usa para el funcionamiento de abrir y cerrar el menú
   * @memberof FilterComponent
   */
  @Input() sidenav;

  /**
   * Variable para observar el input del filtro inicial
   * @memberof FilterComponent
   */
  @ViewChild('dateInitial') dateInitial;

  /**
   * Variable para observar el input del filtro final
   * @memberof FilterComponent
   */
  @ViewChild('dateFinal') dateFinal;

  /**
   * Conjunto de variables necesaria para validar el formulario
   * @memberof FilterComponent
   */
  public formFilter: ModelFilter;
  public listAdminFilterForm: FormGroup;
  public regexNoSpaces = /^((?! \s+|\s+$).)*$/;
  public rangeDays = 14;
  public milisecondsRangeDays = 1000 * 60 * 60 * 24 * this.rangeDays;
  public rangeDateMax;
  public rangeError = false;

  /**
   * Creates an instance of FilterComponent.
   * @param {ListAdminComponent} listAdmin
   * @memberof FilterComponent
   */
  constructor(
    public listAdmin: ListAdminComponent,
    private fb: FormBuilder
  ) {
    this.formFilter = new ModelFilter();
  }

  /**
   * @method ngOnInit
   * @description Metodo que se llama mientras se inicia el componente
   * @memberof FilterComponent
   */
  ngOnInit() {
    this.createForm();
  }

  /**
   * @method createForm
   * @memberof FilterComponent
   * @description Metodo para crear el formulario
   */
  createForm() {
    this.listAdminFilterForm = this.fb.group({
      'dateInitial': [null, Validators.compose([Validators.required])],
      'dateFinal': new FormControl(null, Validators.compose([Validators.required, Validators.pattern(this.regexNoSpaces)])),
      'ean': [null, Validators.compose([Validators.pattern(this.regexNoSpaces)])]
    });
  }

  /**
   * @method toggleMenu
   * @memberof FilterComponent
   * @description Metodo para abrir o cerrar el menu
   */
  toggleMenu() {
    this.sidenav.toggle();
  }

  /**
   * @method setMaxDateRange
   * @memberof FilterComponent
   * @description Set the date final of filter
   */
  setMaxDateRange() {
    if (this.listAdminFilterForm.value.dateInitial != null) {
      this.rangeDateMax = new Date(this.listAdminFilterForm.value.dateInitial.getTime() + this.milisecondsRangeDays);
    }
  }

  /**
   * @method validateFinalRange
   * @memberof FilterComponent
   * @description Validate the range of dates for filter
   */
  validateFinalRange() {
    if (this.listAdminFilterForm.value.dateFinal != null && this.listAdminFilterForm.value.dateInitial != null) {
      if ((this.listAdminFilterForm.value.dateFinal.getTime() - this.listAdminFilterForm.value.dateInitial.getTime()) > (1000 * 60 * 60 * 24 * (this.rangeDays++))) {
        this.rangeError = true;
      }
    }
  }

  /**
   * @method openDateInitial
   * @description Metodo para abrir el popup del datepicker cuando se hace click en el input de fecha inicial
   * @memberof FilterComponent
   */
  openDateInitial() {
    this.dateInitial.open();
  }

  /**
   * @method openDateFinal
   * @description Metodo para abrir el popup del datepicker cuando se hace click en el input de fecha final
   * @memberof FilterComponent
   */
  openDateFinal() {
    this.dateFinal.open();
  }

  clearAndSubmit() {
    this.listAdminFilterForm.reset();

    if (this.listAdmin.filterActive) {
      this.listAdmin.listAdminFilter(this.listAdminFilterForm);
      this.listAdmin.filterActive = false;
    }
  }

}
