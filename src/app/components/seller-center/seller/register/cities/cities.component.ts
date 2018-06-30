import { Component, OnInit, Inject, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { Validators, FormControl, FormGroup, FormGroupDirective, NgForm } from '@angular/forms';
import { CitiesServices } from './cities.services';
import { Cities } from '../models/cities.model';
import { ErrorStateMatcher } from '@angular/material';
import { ShellComponent } from '../../../../../core/shell/shell.component';


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

  listItems: {};
  citiesFormControl: FormControl;
  validateFormRegister: FormGroup;
  citiesObject: Cities;
  matcher: MyErrorStateMatcher;

  @Input() idState: number;

  @Output() daneCodeEvent = new EventEmitter<number>();

  constructor(
    @Inject(CitiesServices)
    private dataService: CitiesServices,
    public shellComponent: ShellComponent) {
    this.citiesObject = new Cities();
  }

  ngOnInit() {
    this.validateFormRegister = new FormGroup({
      citiesFormControl: new FormControl({ value: '', disabled: true }, [Validators.required])
    });
    this.matcher = new MyErrorStateMatcher();
  }

  ngOnChanges(changes) {
    if (this.idState && this.idState !== undefined && this.idState !== null) {
      this.getCitiesDropdown(this.idState);
      this.daneCodeEvent.emit(null);
    }
  }
  getCitiesDropdown(state) {
    this.shellComponent.loadingComponent.viewLoadingSpinner();
    this.dataService.fetchData(state).subscribe(
      (result: any) => {
        if (result.status === 200) {
          const data = result.body.Data;
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

  setDataCitie(param) {
    this.daneCodeEvent.emit(param);
  }
}
