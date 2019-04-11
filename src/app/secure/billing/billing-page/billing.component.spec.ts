/* 3rd party components */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

/* our own custom components */
import { BillingModule } from '../billing.module';
import { BillingComponent } from './billing.component';
import { ShellComponent } from '@app/core/shell';
import { MatSidenavModule } from '@angular/material';


// fdescribe('BillingComponent', () => {
//   let component: BillingComponent;
//   let fixture: ComponentFixture<BillingComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       imports: [
//         RouterTestingModule,
//         BillingModule,
//         MatSidenavModule
//       ],
//       declarations: [
//         ShellComponent,
//       ]
//     }).compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(BillingComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
