import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '@app/material.module';
import { SharedModule } from '@app/shared/shared.module';
import { CognitoUtil, EndpointService, UserParametersService } from '@app/core';
import { ShellComponent } from '@app/core/shell';
import { ComponentsService, EventEmitterOrders } from '@app/shared';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA  } from '@angular/material';
import { InfoIndicatorsComponent } from '../info-indicators/info-indicators.component';

describe('qualityIndicator', () => {

  let component: InfoIndicatorsComponent;
  let fixture: ComponentFixture<InfoIndicatorsComponent>;

  const response = {
    data: true,
    errors: [],
    message: null,
    pendingResponse: false,
  };


  const respondeRegex = {
    body: {
      body: '{"Errors":[],"Data":[],"Message":""}',
      isBase64Encoded: false,
      statusCode: 200
    },
    ok: true,
    status: 200,
    statusText: 'OK',
    type: 4
  };



  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        SharedModule
      ],
      declarations: [InfoIndicatorsComponent],
      providers: [
        EndpointService,
        UserParametersService,
        ShellComponent,
        { provide: MatBottomSheetRef, useValue: [] },
        ComponentsService,
        EventEmitterOrders,
        { provide: MAT_BOTTOM_SHEET_DATA, useValue: [] },
        CognitoUtil
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoIndicatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  afterAll(() => {
    TestBed.resetTestingModule();
  });
});

