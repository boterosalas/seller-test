// import { fakeAsync, ComponentFixture, TestBed, async } from '@angular/core/testing';
// import { MatSidenavModule, MatSidenavContainer } from '@angular/material/sidenav';
// import { CaseToolbarComponent } from './case-toolbar.component';
// import { NO_ERRORS_SCHEMA, EventEmitter } from '@angular/core';
// import { TranslateModule } from '@ngx-translate/core';
// import { MatPaginatorModule, PageEvent, MatPaginator, MatIconModule, MatToolbarModule, _MatPaginatorBase } from '@angular/material';
// import { Observable } from 'rxjs';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// describe('CaseToolbarComponent', () => {
//   let component: CaseToolbarComponent;
//   let fixture: ComponentFixture<CaseToolbarComponent>;

//   beforeEach(fakeAsync(() => {
//     TestBed.configureTestingModule({
//       declarations: [
//         CaseToolbarComponent,
//       ],
//       imports: [
//         MatSidenavModule,
//         MatToolbarModule,
//         TranslateModule.forRoot({}),
//         MatPaginatorModule,
//         MatIconModule,
//         MatToolbarModule,
//         BrowserAnimationsModule
//       ],
//       providers: [
//       ],
//     }).compileComponents();

//     fixture = TestBed.createComponent(CaseToolbarComponent);
//     component = fixture.componentInstance;
//     component.pageIndex = 2;
//     component.pageLabel = 'pageLabel';
//     component.pageSize = 1;
//     component.length = 1;
//     fixture.autoDetectChanges();
//   }));

//   it('should compile', (done) => {
//     expect(component).toBeTruthy();
//     done();
//   });

//   it('should emmit toggle', (done) => {
//     const spy = spyOn(component.toggleFilter, 'emit');
//     component.onToggleFilter();
//     expect(spy).toHaveBeenCalled();
//     done();
//   });
// });
