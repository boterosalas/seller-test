// import { async, ComponentFixture, TestBed } from "@angular/core/testing";
// import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
// import { MaterialModule } from "@app/material.module";
// import { TranslateModule } from "@ngx-translate/core";

// import { InfoModalSupportComponent } from "./info-modal-support.component";

// describe("InfoModalSupportComponent", () => {
//   let component: InfoModalSupportComponent;
//   let fixture: ComponentFixture<InfoModalSupportComponent>;

//   const mockDialog = jasmine.createSpyObj("MatDialogRef", [
//     "open, close, afterClosed",
//   ]);
//   let data = {
//     dataProduct: {
//       imageUrl: "https://image.test",
//       ean: "1",
//       productName: "nevera",
//       sku: "123",
//       brand: "samnsung",
//       sellerSku: "123",
//       price: "10000",
//       quantity: 1,
//     },
//   };

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [InfoModalSupportComponent],
//       imports: [MaterialModule, TranslateModule.forRoot({})],
//       providers: [
//         { provide: MatDialogRef, useValue: mockDialog },
//         { provide: MAT_DIALOG_DATA, useValue: data },
//       ],
//     }).compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(InfoModalSupportComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it("should create", () => {
//     expect(component).toBeTruthy();
//   });
// });
