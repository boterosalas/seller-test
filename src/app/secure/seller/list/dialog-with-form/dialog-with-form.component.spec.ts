import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogWithFormComponent } from './dialog-with-form.component';
import { MaterialModule } from '@app/material.module';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { FormGroup, FormControl, Validators } from '@angular/forms';

describe('DialogWithFormComponent', () => {
  let component: DialogWithFormComponent;
  let fixture: ComponentFixture<DialogWithFormComponent>;
  const mockDialog = jasmine.createSpyObj('MatDialogRef', ['open, close, afterClosed']);
  let data = {};
  let confirmationSpy;
  let cancelSpy;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogWithFormComponent ],
      imports: [MaterialModule],
      providers: [
        {provide: MatDialogRef, useValue: mockDialog},
        {provide: MAT_DIALOG_DATA, useValue: data}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogWithFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  beforeEach(()=> {
    component.data = {
      icon: 'cancel',
      title: 'El titulo',
      message: 'el mensaje',
      messageCenter: false,
      form: null
    };

    component.valid = false;

    component.confirmation = () => {
      component.data.message = 'Mensaje Confirmado'
      return of(true);
    };

    confirmationSpy = spyOn(component, 'confirmation');
    cancelSpy = spyOn(component, 'onNoClick');
  });

  it('Should not valid the confirmation button', () => {
    const formGroup = new FormGroup({});
    formGroup.addControl('IdSeller', new FormControl('', Validators.required))
    component.data.form = formGroup;
    const confirmationButton = fixture.debugElement.query(By.css('#btn-confirmation')).nativeElement;
    fixture.detectChanges();
    expect(confirmationButton.disabled).toBeTruthy();
  });

  it('Should valid the confirmation button', () => {
    const confirmationButton = fixture.debugElement.query(By.css('#btn-confirmation')).nativeElement;
    confirmationButton.click();
    fixture.detectChanges();
    expect(confirmationSpy).toHaveBeenCalled();
  });

  it('Should be click cancel button', () => {
    const cancelButton = fixture.debugElement.query(By.css('#btn-cancel')).nativeElement;
    cancelButton.click();
    fixture.detectChanges();
    expect(cancelSpy).toHaveBeenCalled();
  });

});
