import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentProcessComponent } from './component-process.component';
import { MatStepperModule, MatInputModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UnitProductModule } from '@app/secure/products';
import { ShellModule } from '../../../../core/shell/shell.module';
import { LoadingService, EndpointService, UserParametersService, CognitoUtil, UserLoginService, DynamoDBService } from '@app/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('ComponentProcessComponent', () => {
  let component: ComponentProcessComponent;
  let fixture: ComponentFixture<ComponentProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[
        MatStepperModule,
        FormsModule,
        MatInputModule,
        ReactiveFormsModule,
        UnitProductModule,
        ShellModule,
        RouterTestingModule
      ],
      declarations: [ 
        // ComponentProcessComponent
       ],
       providers: [
        LoadingService,
        EndpointService,
        UserParametersService,
        CognitoUtil,
        UserLoginService,
        DynamoDBService
       ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentProcessComponent);
    component = fixture.componentInstance;
    spyOn(component.router, 'navigate').and.returnValue(true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
