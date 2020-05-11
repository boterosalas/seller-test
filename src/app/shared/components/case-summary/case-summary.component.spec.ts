import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

import { CaseSummaryComponent } from './case-summary.component';
import { BasicCardComponent } from '../basic-card/basic-card.component';
import { ConversationComponent } from '../conversation/conversation.component';
import { ConversationMessageComponent } from '../conversation-message/conversation-message.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EndpointService } from '@app/core';

describe('CaseSumaryComponent', () => {
  let component: CaseSummaryComponent;
  let fixture: ComponentFixture<CaseSummaryComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        CaseSummaryComponent,
        BasicCardComponent,
        ConversationComponent,
        ConversationMessageComponent,

      ],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot({}),
        RouterTestingModule,
        MatDialogModule
      ],
      providers: [
        EndpointService
      ]
    })
      .compileComponents();
  }));

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(CaseSummaryComponent);
    component = fixture.componentInstance;
    component.case = {
      createDate: new Date().toDateString(),
      updateDate: new Date().toDateString(),
      customerEmail: "email@gmail.com",
      orderNumber: "2",
      reasonDetail: "2",
      reasonPQR: "",
      status: "ACTIVO",
      caseId: "1234",
      caseNumber: "2",
      description: "this is a description",
      followLast: [],
      id: "123",
      read: false,
      sellerId: "!,2",
    }
    fixture.detectChanges();
  }));

  it('should create', (done) => {
    expect(component).toBeTruthy();
    done();
  });


  it('should have span case-number translate', () => {
    const caseNumberTemplate = document.getElementById('case-summary-view-detail-2');
    expect(caseNumberTemplate.innerText).toBe("secure.parametize.support_claims.view-detail");
  });

  it('should button be enable', () => {
    component.disableButtonAnswer = false;
    fixture.detectChanges();
    const buton: any = document.getElementById('case-summary-reply-btn-2');
    expect(buton.disabled).toBeFalsy();
  });
});
