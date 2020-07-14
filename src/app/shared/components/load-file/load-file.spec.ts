// import { async, TestBed, ComponentFixture, fakeAsync } from '@angular/core/testing';
// import { LoadFileComponent } from './load-file';
// import { HttpClient } from '@angular/common/http';
// import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
// import { MaterialModule } from '@app/material.module';
// import { ngfModule } from 'angular-file';
// import { CommonService } from '@app/shared/services/common.service';
// import { TranslateModule } from '@ngx-translate/core';

// describe('Probando componente para subir archivos.', () => {

//     let fixture: ComponentFixture<LoadFileComponent>;
//     let component: LoadFileComponent;

//     let httpClient: HttpClient;
//     httpClient = <HttpClient>{};

//     beforeEach(fakeAsync( () => {
//         TestBed.configureTestingModule({
//             declarations: [
//                 LoadFileComponent
//             ],
//             providers: [
//                 { provide: HttpClient, useValue: httpClient },
//                 { provide: MAT_DIALOG_DATA, useValue: {} },
//                 { provide: MatDialogRef, useValue: {} },
//                 { provide: MatDialogRef, useValue: {} },
//                 { provide: CommonService, useValue: {} },
//                 { provide: MatSnackBar, useValue: {} },
//             ],
//             imports: [
//                 MaterialModule,
//                 ngfModule,
//                 TranslateModule.forRoot({})

//             ]
//         }).compileComponents();
//     }));

//     beforeEach(() => {
//         fixture = TestBed.createComponent(LoadFileComponent);
//         component = fixture.componentInstance;
//         fixture.detectChanges();
//     });

//     it('Deberia crear LoadFileComponent', () => {
//         expect(component).toBeTruthy();
//     });

//     it('Deberia cancelar la subida del documento', () => {
//         component.cancel();
//         expect(component.progress).toBe(0);
//     });

//     it('Deberia intentar guardar el archivo pero no hay archivo', () => {
//         component.saveFile();
//         expect(component.lastInvalids).toBeUndefined();
//     });

//     // it('Deberia obtener la fecha actual', () => {
//     //     expect(component.getDate().getTime()).toBe(new Date().getTime());
//     // });

// });
