import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseFilterComponent } from './case-filter.component';
import { MaterialModule } from '@app/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('CaseFilterComponent', () => {
  let component: CaseFilterComponent;
  let fixture: ComponentFixture<CaseFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CaseFilterComponent],
      imports: [
        MaterialModule,
        TranslateModule.forRoot({}),
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        RouterTestingModule,
        BrowserAnimationsModule
      ],
      providers: []
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
