import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { State } from './states.model';
import { StatesService } from './states.service';
import { Validators, FormControl, FormGroup, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { ShellComponent } from '../../../../shell/shell.component';

/** Error when invalid control is dirty, touched, or submitted. */
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
  statesFormControl: FormControl;
  validateFormRegister: FormGroup;
  statesObject: State;
  matcher: MyErrorStateMatcher;

  @Output() idStateEvent = new EventEmitter<number>();

  constructor(
    @Inject(StatesService)
    private dataService: StatesService,
    public shellComponent: ShellComponent) {
    this.statesObject = new State();
  }

  ngOnInit() {
    this.validateFormRegister = new FormGroup({
      statesFormControl: new FormControl('', [Validators.required])
    });
    this.matcher = new MyErrorStateMatcher();

    this.getStatesDropdown();
  }

  getStatesDropdown() {
    this.shellComponent.loadingComponent.viewLoadingSpinner();
    this.dataService.fetchData().subscribe(
      (result: any) => {
        if (result.status === 200) {
          const data_response = JSON.parse(result.body.body);
          const data = data_response.Data;
          this.listItems = data;
          this.shellComponent.loadingComponent.closeLoadingSpinner();
        } else {
          this.shellComponent.loadingComponent.closeLoadingSpinner();
          this.shellComponent.modalComponent.showModal('errorService');
        }
      }
    );
  }

  setParamToCities(param) {
    this.idStateEvent.emit(param);
  }
}
