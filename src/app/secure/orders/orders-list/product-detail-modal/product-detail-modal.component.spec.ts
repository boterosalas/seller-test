/* 3rd party components */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

/* our own custom components */
import { ProductDetailModalComponent } from './product-detail-modal.component';
import { OrdersModule } from '../orders.module';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';



describe('ProductDetailModalComponent', () => {
  let component: ProductDetailModalComponent;
  let fixture: ComponentFixture<ProductDetailModalComponent>;

  const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed', 'componentInstance']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot({}),
      ],
      declarations: [
        ProductDetailModalComponent
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: [] },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create Component Product detail modal', () => {
    expect(component).toBeTruthy();
  });

  it('dialog should be closed after onNoClick()', () => {
    component.onNoClick();
    expect(component).toBeTruthy();
  });
});

