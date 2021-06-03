import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { LoadingService } from '@app/core';
import { CognitoUtil, DynamoDBService, UserLoginService, UserParametersService } from '@app/core/aws-cognito';
import { EndpointService } from '@app/core/http';
import { MaterialModule } from '@app/material.module';
import { ComponentsService, EventEmitterOrders } from '@app/shared';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { ShellComponent } from '../..';
import { ShellModule } from '../../shell.module';
import { SearchOrderMenuService } from '../search-order-menu.service';

import { SearchFraudNotificationFormComponent } from './search-fraud-notification-form.component';

describe('SearchFraudNotificationFormComponent', () => {

  const data = {
    sellerId: '11618',
    IdSeller: '11618',
    sellerProfile: 'seller',
    sellerNit: '123',
    sellerName: 'la tienda de cristian 2019 vs 512',
    sellerEmail: 'ccbustamante221@misena.edu.co',
  };
  let component: SearchFraudNotificationFormComponent;
  let fixture: ComponentFixture<SearchFraudNotificationFormComponent>;

    // Mock Services
    const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
    const mockUserLoginService = jasmine.createSpyObj('UserLoginService', ['isAuthenticated']);
    const mockUserParameterService = jasmine.createSpyObj('UserParametersService', ['getUserData']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot({}),
        MaterialModule,
        RouterTestingModule,
        HttpClientTestingModule,
        ShellModule
      ],
      providers: [
        CognitoUtil,
        DynamoDBService,
        EventEmitterOrders,
        ShellComponent,
        ComponentsService,
        SearchOrderMenuService,
        EndpointService,     
        { provide: UserParametersService, useValue: mockUserParameterService },
        { provide: UserLoginService, useValue: mockUserLoginService },
        { provide: LoadingService, useValue: mockLoadingService },
       ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFraudNotificationFormComponent);
    mockUserParameterService.getUserData.and.returnValue(of(data));
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
