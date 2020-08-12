// import { async, ComponentFixture, TestBed } from "@angular/core/testing";

// import { CaseDetailComponent } from "./case-detail.component";
// import { BasicCardComponent } from "../basic-card/basic-card.component";
// import { TranslateModule } from "@ngx-translate/core";
// import { ConversationMessageComponent } from "../conversation-message/conversation-message.component";
// import { ConversationComponent } from "../conversation/conversation.component";
// import { CommonService } from "@app/shared/services/common.service";
// import { MatIconModule, MatDialogModule, MatSnackBarModule } from "@angular/material";
// import { HttpClientTestingModule } from "@angular/common/http/testing";
// import { EndpointService } from "@app/core";

// describe("CaseDetailComponent", () => {
//   let component: CaseDetailComponent;
//   let fixture: ComponentFixture<CaseDetailComponent>;

//   const mockEndpointService = <EndpointService>{
//     get: (name: string, params?: any[], version: string = null): string => ''
//   };

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [
//         CaseDetailComponent,
//         BasicCardComponent,
//         ConversationMessageComponent,
//         ConversationComponent
//       ],
//       imports: [
//         MatIconModule,
//         MatDialogModule,
//         MatSnackBarModule,
//         TranslateModule.forRoot({}),
//         HttpClientTestingModule
//       ],
//       providers: [
//         CommonService,
//         { provide: EndpointService, useValue: mockEndpointService },

//       ]
//     }).compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(CaseDetailComponent);
//     component = fixture.componentInstance;
//     component.case = {
//       id: "string",
//       sellerId: "string",
//       caseId: "string",
//       status: "Cerrado",
//       orderNumber: "string",
//       reasonPQR: "string",
//       reasonDetail: "string",
//       description: "string",
//       descriptionSolution: "string",
//       createDate: "string",
//       updateDate: "string",
//       customerEmail: "string",
//       read: false,
//       follow: [],
//       attachments: [],
//       caseNumber: "string",
//     }
//     fixture.detectChanges();
//   });

//   it("should create", () => {
//     expect(component).toBeTruthy();
//   });

//   it("should isClosed to be true", () => {
//     expect(component.isClosed).toBeTruthy();
//   });

//   it("should emit reply event", () => {
//     component.case = {
//       id: "string",
//       sellerId: "string",
//       caseId: "string",
//       status: "Abierto",
//       orderNumber: "string",
//       reasonPQR: "string",
//       reasonDetail: "string",
//       description: "string",
//       descriptionSolution: "string",
//       createDate: "string",
//       updateDate: "string",
//       customerEmail: "string",
//       read: false,
//       follow: [],
//       attachments: [],
//       caseNumber: "string",
//     }
//     fixture.detectChanges()
//     component.ngOnInit();
//     const emit = spyOn(component.reply, 'emit');
//     component.openResponseDialog()
//     expect(component.isClosed).toBeFalsy();
//     expect(emit).toHaveBeenCalled();
//   });

//   it("should isClosed to be false", () => {
//     component.case = {
//       id: "string",
//       sellerId: "string",
//       caseId: "string",
//       status: "Abierto",
//       orderNumber: "string",
//       reasonPQR: "string",
//       reasonDetail: "string",
//       description: "string",
//       descriptionSolution: "string",
//       createDate: "string",
//       updateDate: "string",
//       customerEmail: "string",
//       read: false,
//       follow: [],
//       attachments: [],
//       caseNumber: "string",
//     }
//     fixture.detectChanges()
//     component.ngOnInit();
//     expect(component.isClosed).toBeFalsy();
//   });

// });

