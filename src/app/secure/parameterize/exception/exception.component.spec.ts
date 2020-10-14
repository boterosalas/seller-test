import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '@app/material.module';
import { ExceptionComponent } from './exception.component';
import { SharedModule } from '@app/shared/shared.module';
import { EndpointService, LoadingService, UserLoginService, UserParametersService } from '@app/core';
import { SupportService } from '@app/secure/support-modal/support.service';
import { of } from 'rxjs';
import { ComponentsService, EventEmitterOrders } from '@app/shared';
import { StoreService } from '@app/store/store.service';
import { ConfigurationState } from '@app/store/configuration';
import { StoresService } from '@app/secure/offers/stores/stores.service';
import { ShellComponent } from '@app/core/shell';

describe('ExceptionComponent', () => {
  let component: ExceptionComponent;
  let fixture: ComponentFixture<ExceptionComponent>;

  const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
  const mockComponentsService = jasmine.createSpyObj('ComponentsService', ['openSnackBar']);
  const mockUserLoginService = jasmine.createSpyObj('UserLoginService', ['isAuthenticated']);
  const mockUserParameterService = jasmine.createSpyObj('UserParametersService', ['getUserData']);

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
      declarations: [ ExceptionComponent ],
      providers: [
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: ComponentsService, useValue: mockComponentsService },
        { provide: StoreService, useClass: StoreServiceTest },
        { provide: EventEmitterOrders, useClass: EventEmitterOrdersTest },
        { provide: UserLoginService, useValue: mockUserLoginService },
        { provide: UserParametersService, useValue: mockUserParameterService },
        StoresService,
        EndpointService,
        ShellComponent,
        SupportService,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


class SupportServiceTest {
  sendSupportMessage(user: any, supportMessage: any) {
    const returnObj = { obk: 'qwe' };
    return of(returnObj);
  }
}

class StoreServiceTest {
  getStateConfiguration() {
    const configurationState: ConfigurationState = { language: 'US', statusCases: [] };
    return of({
      appConfiguration: configurationState,
      configuration: { modules: [] },
      notification: {
        sumaUnreadDevolutions: 2,
        unreadCases: 2,
        unreadDevolutions: 2,
        unreadPendings: 2
      }
    });
  }
}

class EventEmitterOrdersTest {

  filterParams: EventEmitter<any> = new EventEmitter<any>();

  objectToEmit = {
    data: {
      nombre: 'Manuel',
      title: 'hello'
    }
  };

  constructor() {
    this.filterParams.emit(this.objectToEmit);
  }

}
