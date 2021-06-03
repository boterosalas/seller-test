import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { CognitoUtil, DynamoDBService, EndpointService, LoadingService, ModalService, UserLoginService, UserParametersService } from '@app/core';
import { ShellComponent } from '@app/core/shell';
import { SearchOrderMenuService } from '@app/core/shell/search-order-menu/search-order-menu.service';
import { ShellModule } from '@app/core/shell/shell.module';
import { MaterialModule } from '@app/material.module';
import { ComponentsService, EventEmitterOrders } from '@app/shared';
import { TranslateModule } from '@ngx-translate/core';

import { UploadFraudComponent } from './upload-fraud.component';

describe('UploadFraudComponent', () => {
  let component: UploadFraudComponent;
  let fixture: ComponentFixture<UploadFraudComponent>;

 // Mock Services
 const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
 const mockUserLoginService = jasmine.createSpyObj('UserLoginService', ['isAuthenticated']);
 const mockUserParameterService = jasmine.createSpyObj('UserParametersService', ['getUserData']);
 const mockDialog = jasmine.createSpyObj('MatDialogRef', ['open, close, afterClosed']);
 let data = {};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadFraudComponent ],
      imports: [
          TranslateModule.forRoot({}),
          MaterialModule,
          ShellModule,
          RouterTestingModule
      ],
      providers:[
        { provide: MatDialogRef, useValue: mockDialog },
        { provide: MAT_DIALOG_DATA, useValue: data },
        ShellComponent,
        CognitoUtil,
        DynamoDBService,
        EventEmitterOrders,
        ComponentsService,
        EndpointService,
        ModalService,
        { provide: UserParametersService, useValue: mockUserParameterService },
        { provide: UserLoginService, useValue: mockUserLoginService },
        { provide: LoadingService, useValue: mockLoadingService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadFraudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
