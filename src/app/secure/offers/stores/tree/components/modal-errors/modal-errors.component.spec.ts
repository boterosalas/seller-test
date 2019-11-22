// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { MaterialModule } from '@app/material.module';
// import { ModalErrorsComponent } from './modal-errors.component';
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// import { TranslateModule } from '@ngx-translate/core';

// describe('ModalErrorsComponent', () => {
//   let component: ModalErrorsComponent;
//   let fixture: ComponentFixture<ModalErrorsComponent>;

//   const mockDialog = jasmine.createSpyObj('MatDialogRef', ['open, close, afterClosed']);
//   const data = {
//     response: {
//       ok: true,
//       status: 200,
//       body: {
//         body: {
//           Message: 'Operación realizada éxitosamente.',
//           Errors: null,
//           Data: true
//         }
//       }
//     }
//   };

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ModalErrorsComponent],
//       imports: [
//         MaterialModule,
//         TranslateModule.forRoot({})
//       ],
//       providers: [
//         { provide: MatDialogRef, useValue: mockDialog },
//         { provide: MAT_DIALOG_DATA, useValue: data }
//       ]
//     })
//       .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(ModalErrorsComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
