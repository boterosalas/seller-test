import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

import { DetailCaseComponent } from './detail-case.component';
import { SharedModule } from '@app/shared/shared.module';
import { MaterialModule } from '@app/material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterModule } from '@angular/router';
import { EndpointService, LoadingService } from '@app/core';
import { Store } from '@ngrx/store';
import { MatSidenavContainer } from '@angular/material';
import { SellerSupportCenterService } from '../services/seller-support-center.service';
import { of } from 'rxjs';
import { StoreService } from '@app/store/store.service';

describe('DetailCaseComponent', () => {
  let component: DetailCaseComponent;
  let fixture: ComponentFixture<DetailCaseComponent>;
  let storeMock;
  const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DetailCaseComponent],
      imports: [
        SharedModule,
        RouterTestingModule,
        RouterModule,
      ],
      providers: [
        EndpointService,
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: MatSidenavContainer, useValue: {} },
        { provide: Store, useValue: storeMock },
        { provide: StoreService, useClass: StoreServiceTest },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailCaseComponent);
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

class StoreServiceTest {
  getStateConfiguration() {
    const objj = {
      language: 'ES',
      statusCases: [
        {
          id: 2,
          code: 2,
          name: 'string',
          description: 'string',
          default: false,
          active: false,
          createDate: 'string',
          updateDate: 'string',
        }
      ],
    };
    return of(objj);
  }

}
