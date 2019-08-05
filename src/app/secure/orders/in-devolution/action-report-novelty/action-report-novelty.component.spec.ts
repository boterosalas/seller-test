/* 3rd party components */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

/* our own custom components */
import { InDevolutionModule } from '@root/src/app/secure/orders/in-devolution/in-devolution.module';
import { ActionReportNoveltyComponent } from './action-report-novelty.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { DialogWithFormComponent } from '@app/shared/components/dialog-with-form/dialog-with-form.component';
import { MaterialModule } from '@app/material.module';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ComponentsService } from '@app/shared';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { InDevolutionService } from '../in-devolution.service';
import { UserParametersService, EndpointService } from '@app/core';

fdescribe('ActionReportNoveltyComponent', () => {
  let component: ActionReportNoveltyComponent;
  let fixture: ComponentFixture<ActionReportNoveltyComponent>;

  const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed', 'componentInstance']);
  const mockUserParameterService = jasmine.createSpyObj('UserParametersService', ['getUserData', 'clearUserData', 'getParameters', 'getAttributes', 'getSession']);
  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule
      ],
      declarations: [
        ActionReportNoveltyComponent,
      ],
      providers: [
        ComponentsService,
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: [] },
        InDevolutionService,
        { provide: UserParametersService, useValue: mockUserParameterService },
        EndpointService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [DialogWithFormComponent]
      }
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionReportNoveltyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Funciones descarga de las órdene', () => {
    const myform = formBuilder.group({
      observation: { value: '' },
      reason: { value: '' }
    });
    beforeEach(() => {
      // component.user = data;
      fixture.detectChanges();
    });
    // it('Método para realizar la descarga de las órdenes.', () => {
    //   component.reportNovelty(myform);
    // });
  });
});

