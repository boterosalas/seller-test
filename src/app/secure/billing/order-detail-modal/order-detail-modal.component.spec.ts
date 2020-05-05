/* 3rd party components */
import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

/* our own custom components */
import { OrderBillingDetailModalComponent } from './order-detail-modal.component';
import { BillingModule } from '../billing.module';
import { ShellModule } from '@app/core/shell/shell.module';
import { SharedModule } from '@app/shared/shared.module';
import { LoadingService } from '@app/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';


describe('OrderBillingDetailModalComponent', () => {
  let component: OrderBillingDetailModalComponent;
  let fixture: ComponentFixture<OrderBillingDetailModalComponent>;
  const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        BillingModule,
        ShellModule,
        SharedModule,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: LoadingService, useValue: mockLoadingService},
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderBillingDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (done) => {
    expect(component).toBeTruthy();
    done();
  });



});

