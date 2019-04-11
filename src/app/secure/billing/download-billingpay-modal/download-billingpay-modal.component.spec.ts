import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSnackBarModule, MatFormFieldControl, MatInputModule } from '@angular/material';
import { DownloadBillingpayModalComponent } from './download-billingpay-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatIconModule, MatError, MatFormField } from '@angular/material';
import { CommonModule, DatePipe } from '@angular/common';
import { ComponentsService } from '../../../shared';
import { UserParametersService, UserLoginService, LoadingService } from '@app/core';
import { CognitoUtil } from '@core/aws-cognito';
import { BillingService } from '../billing.service';
import { HttpClientModule } from '@angular/common/http';
import { EndpointService } from '@app/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

describe('DownloadBillingpayModalComponent', () => {
  let component: DownloadBillingpayModalComponent;
  let fixture: ComponentFixture<DownloadBillingpayModalComponent>;

  const userData = {sellerProfile: 'administrator'}; 
   // Mock Services 
   const mockUserLoginService = jasmine.createSpyObj('UserLoginService', ['isAuthenticated']); 
   const mockUserParameterService = jasmine.createSpyObj('UserParametersService', ['getUserData']); 

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        MatDialogModule,
        CommonModule,
        ReactiveFormsModule,
        MatIconModule,
        MatSnackBarModule,
        HttpClientModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
      declarations: [ 
        DownloadBillingpayModalComponent
      ],
       providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: [] },
        ComponentsService,
        { provide: UserParametersService, useValue: mockUserParameterService }, 
        { provide: UserLoginService, useValue: mockUserLoginService },
        CognitoUtil,
        BillingService,
        EndpointService,
        DatePipe,
        LoadingService
       ]
    })
    .compileComponents();
    const mockUser = Object.assign({}, userData);
    const responseGetUser = { 
      body: { 
        body: JSON.stringify({ Data: mockUser }) 
      } 
    }; 
    // Define la respuesta de la información de un usuario 
    mockUserParameterService.getUserData.and.returnValue(of(responseGetUser)); 
    mockUserLoginService.isAuthenticated.and.returnValue(true); 
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadBillingpayModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('valid email', ()=> {
    const emailField = fixture.debugElement.query(By.css('#emailPago'));
    expect(emailField).toBeTruthy();
    const emailNativeElement = emailField.nativeElement;
    emailNativeElement.value = 'prueba@hotmail.com';
    emailNativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.myform.controls.email.errors).toBeNull();
  });

  it('invalid email', ()=> {
    const emailField = fixture.debugElement.query(By.css('#emailPago'));
    expect(emailField).toBeTruthy();
    const emailNativeElement = emailField.nativeElement;
    emailNativeElement.value = 'prueba';
    emailNativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.myform.controls.email.errors).not.toBeNull();
  });

});
