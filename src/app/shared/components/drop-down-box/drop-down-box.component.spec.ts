import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropDownBoxComponent } from './drop-down-box.component';
import { MatExpansionModule, MatIconModule } from '@angular/material';
import { DateNoGtmPipe } from '@app/shared/pipes/date-no-gtm.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';

describe('DropDownBoxComponent', () => {
  let component: DropDownBoxComponent;
  let fixture: ComponentFixture<DropDownBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DropDownBoxComponent,
        DateNoGtmPipe
      ],
      imports: [
        TranslateModule.forRoot({}),
        MatExpansionModule,
        MatIconModule,
        BrowserAnimationsModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropDownBoxComponent);
    component = fixture.componentInstance;
    component.data = {
      attachments: [],
      caseNumber: '',
      createDate: new Date().toDateString(),
      lastPost: '',
      orderNumber: '',
      reasonDetail: '',
      reasonPQR: '',
      status: '',
      lastPostDesc: '',
      id: ''
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('index should be 1', () => {
    component.index = 1;
    fixture.detectChanges();
    expect(component.index).toBe(1);
  });

  it('casenumber should be 1220 in template', () => {
    component.index = 1;
    component.data = {
      attachments: [],
      caseNumber: '1220',
      createDate: new Date().toDateString(),
      lastPost: '',
      orderNumber: '',
      reasonDetail: '',
      reasonPQR: '',
      status: '',
      lastPostDesc: '',
      id: ''
    };
    fixture.detectChanges();
    const caseNumberTpl = document.getElementById('dpbox-case-id-1');
    expect(caseNumberTpl.innerText).toEqual(component.data.caseNumber);
  });

  it('orderNumber should be 1220 in template', () => {
    component.index = 1;
    component.data = {
      attachments: [],
      caseNumber: '',
      createDate: new Date().toDateString(),
      lastPost: '',
      orderNumber: '1220',
      reasonDetail: '',
      reasonPQR: '',
      lastPostDesc: '',
      status: '',
      id: ''
    };
    fixture.detectChanges();
    const orederNumberTpl = document.getElementById('dpbox-case-number-1');
    expect(orederNumberTpl.innerText).toEqual(component.data.orderNumber);
  });

  it('status should be active in template', () => {
    component.index = 1;
    component.data = {
      attachments: [],
      caseNumber: '2',
      createDate: new Date().toDateString(),
      lastPost: '2',
      orderNumber: '2',
      reasonDetail: '2',
      reasonPQR: '',
      lastPostDesc: 'Respuesta Vendedor',
      status: 'ACTIVO',
      id: '1234'
    };
    fixture.detectChanges();
    const caseStatusTpl = document.getElementById('dpbox-case-status-1');
    expect(caseStatusTpl.innerText).toEqual(component.data.status);
  });

  it('date should be currentDate in template', () => {
    component.index = 1;
    component.data = {
      attachments: [],
      caseNumber: '2',
      createDate: new Date().toDateString(),
      lastPost: '2',
      orderNumber: '2',
      reasonDetail: '2',
      reasonPQR: '',
      lastPostDesc: 'Respuesta Vendedor',
      status: 'ACTIVO',
      id: '1234'
    };
    fixture.detectChanges();
    const dateTpl = document.getElementById('dpbox-case-date-1');
    const datePipe = new DatePipe('en');
    expect(dateTpl.innerText).toEqual(datePipe.transform(component.data.createDate));
  });
});
