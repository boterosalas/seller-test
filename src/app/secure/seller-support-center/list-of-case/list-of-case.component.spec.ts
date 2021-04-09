import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {
  MatSidenavContainer,
} from '@angular/material';
import { ListOfCaseComponent } from './list-of-case.component';
import { EndpointService, LoadingService, ModalService } from '@app/core';
import { ActivatedRoute } from '@angular/router';
import { of, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { MyProfileService } from '@app/secure/aws-cognito/profile/myprofile.service';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { EventEmitterSeller } from '@app/shared/events/eventEmitter-seller.service';
import { FlexModule } from '@angular/flex-layout';
import { ConfigurationState } from '@app/store/configuration';
import { StoreService } from '@app/store/store.service';
import { EventEmitter, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SupportService } from '@app/secure/support-modal/support.service';
import { MaterialModule } from '@app/material.module';
import { SharedModule } from '@app/shared/shared.module';


describe('ListOfCaseComponent', () => {
  let component: ListOfCaseComponent;
  let fixture: ComponentFixture<ListOfCaseComponent>;
  const configurationState: ConfigurationState = { language: 'US', statusCases: [] };
  const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
  const mockDialogError = jasmine.createSpyObj('ModalService', ['showModal']);
  const mockMyProfileService = jasmine.createSpyObj('MyProfileService', ['getUser']);
  const mockSupportService = jasmine.createSpyObj('SupportService', ['getListClassification','getRegexFormSupport']);


  const data = {
    body: {
      body:'{ "Data": []}'
    },
    ok: true,
    status: 200,
    statusText: "OK"
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ListOfCaseComponent
      ],
      imports: [
        HttpClientModule,
        FlexModule,
        TranslateModule.forRoot({}),
        RouterTestingModule,
        BrowserAnimationsModule,
        MaterialModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [
        DatePipe,
        { provide: SupportService, useClass: SupportServiceTest },
        EndpointService,
        { provide: EventEmitterSeller, useClass: EventEmitterSellerTest },
        {
          provide: ActivatedRoute, useValue: {
            queryParams: of(
              {
                Status: ['id_params_test']
              }
            ),
            snapshot: {
              paramMap: { get: () => 1 }
            }
          }
        },
        { provide: Store, useClass: StoreTest },
        { provide: StoreService, useClass: StoreServiceTest },
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: ModalService, useValue: mockDialogError },
        { provide: MyProfileService, useClass: MyProfileServiceTest },
        { provide: MatSidenavContainer, useValue: {} },
        { provide: SupportService, useValue: mockSupportService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    mockSupportService.getListClassification.and.returnValue(of(data));
    mockSupportService.getRegexFormSupport.and.returnValue(of(data));
    fixture = TestBed.createComponent(ListOfCaseComponent);
    component = fixture.componentInstance;
    component.filter = false;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


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

class StoreTest {
  select(): Observable<any> {
    return of(
      {
        notification: {
          unreadCases: 2
        }
      }
    );
  }
}

class EventEmitterSellerTest {

  eventSearchSeller = new EventEmitter<any>();
  seller = {
    IdSeller: 'qwe'
  };

  constructor() {
    this.eventSearchSeller.next(this.seller);
  }

  searchSeller(seller: any) {
    this.eventSearchSeller.emit(seller);
  }
}

class MyProfileServiceTest {
  getUser() {
    const responseTxt =
      JSON.stringify(
        {
          Data: {
            IdSeller: 'as',
            Profile: 'seller'
          }
        }
      );
    const response = {
      body: { body: responseTxt }
    };
    return of(response);
  }
}

class SupportServiceTest {
  sendSupportMessage(user: any, supportMessage: any) {
    const returnObj = { obk: 'qwe' };
    return of(returnObj);
  }

  public getRegexFormSupport(params: any): Observable<any> {
    const responseTxt = JSON.stringify({ Data: ['reclamaciones'] });
    const response = { body: { body: responseTxt } };
    return of(response);
  }

  public getClassification(): Observable<any> {
    const classification = {
      class: 'we'
    };
    return of(classification);
  }
}
