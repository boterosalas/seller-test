import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRuleOfferComponent } from './modal-rule-offer.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogModule, MatDialogRef, MatIconModule, MatSnackBarModule, MatInputModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ModalRuleOfferComponent', () => {
  let component: ModalRuleOfferComponent;
  let fixture: ComponentFixture<ModalRuleOfferComponent>;

  const dialogMock = { close: () => { } };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModalRuleOfferComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatDialogModule,
        HttpClientModule,
        CommonModule,
        ReactiveFormsModule,
        MatIconModule,
        MatSnackBarModule,
        HttpClientModule,
        MatInputModule,
        BrowserAnimationsModule,
        SharedModule,
        TranslateModule.forRoot({})],
        providers: [
          { provide: MatDialogRef, useValue: dialogMock }
        ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalRuleOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
