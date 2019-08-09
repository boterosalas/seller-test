/* 3rd party components */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

/* our own custom components */
import { InDevolutionModule } from '@root/src/app/secure/orders/in-devolution/in-devolution.module';
import { ActionConfirmReceiptComponent } from './action-confirm-receipt.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { DialogWithFormComponent } from '@app/shared/components/dialog-with-form/dialog-with-form.component';


describe('ActionConfirmReceiptComponent', () => {
  let component: ActionConfirmReceiptComponent;
  let fixture: ComponentFixture<ActionConfirmReceiptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
      ],
      declarations: [
        ActionConfirmReceiptComponent,
      ],
      providers: [
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [DialogWithFormComponent]
      }
    });
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(ActionConfirmReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

