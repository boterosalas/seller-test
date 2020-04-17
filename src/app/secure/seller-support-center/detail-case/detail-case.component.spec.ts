import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailCaseComponent } from './detail-case.component';
import { SharedModule } from '@app/shared/shared.module';
import { MaterialModule } from '@app/material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterModule } from '@angular/router';
import { EndpointService, LoadingService } from '@app/core';
import { Store } from '@ngrx/store';
import { MatSidenavContainer } from '@angular/material';

describe('DetailCaseComponent', () => {
  let component: DetailCaseComponent;
  let fixture: ComponentFixture<DetailCaseComponent>;
  let storeMock;
  const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DetailCaseComponent],
      imports: [
        SharedModule,
        RouterTestingModule,
        RouterModule,
      ],
      providers:[
        EndpointService,
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: MatSidenavContainer, useValue: {} },
        { provide: Store, useValue: storeMock },
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
});
