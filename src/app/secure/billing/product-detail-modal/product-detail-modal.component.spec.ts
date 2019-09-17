/* 3rd party components */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

/* our own custom components */
import { BillingModule } from '../billing.module';
import { ProductDetailBillingModalComponent } from './product-detail-modal.component';
import { ShellModule } from '@app/core/shell/shell.module';
import { SharedModule } from '@app/shared/shared.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LoadingService } from '@app/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';


describe('ProductDetailBillingModalComponent', () => {
  let component: ProductDetailBillingModalComponent;
  let fixture: ComponentFixture<ProductDetailBillingModalComponent>;
  const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);

  beforeEach(async(() => {
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
    fixture = TestBed.createComponent(ProductDetailBillingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

