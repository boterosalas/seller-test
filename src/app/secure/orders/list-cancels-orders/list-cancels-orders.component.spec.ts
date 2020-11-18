import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { UserParametersService } from '@app/core';
import { MaterialModule } from '@app/material.module';
import { StoreTestModule } from '@app/secure/seller-support-center/store-test/store-test.module';
import { StateObservable, Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { ListCancelsOrdersComponent } from './list-cancels-orders.component';

describe('ListCancelsOrdersComponent', () => {
  let component: ListCancelsOrdersComponent;
  let fixture: ComponentFixture<ListCancelsOrdersComponent>;

  const data = {
    sellerId: '11618',
    sellerProfile: 'seller',
    sellerNit: '123',
    sellerName: 'la tienda de cristian 2019 vs 512',
    sellerEmail: 'ccbustamante221@misena.edu.co',
  };

  const mockUserParameterService = jasmine.createSpyObj('UserParametersService', ['getUserData']);

  beforeEach(async(() => {
    class StoreMock {
      select = jasmine.createSpy().and.returnValue(of({}));
      pipe = jasmine.createSpy().and.returnValue(of('success'));
  }
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({}),
      ],
      declarations: [ ListCancelsOrdersComponent ],
      providers: [
        { provide: UserParametersService, useValue: mockUserParameterService },
        { provide: Store, useClass: StoreMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCancelsOrdersComponent);
    component = fixture.componentInstance;
    mockUserParameterService.getUserData.and.returnValue(of(data));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
