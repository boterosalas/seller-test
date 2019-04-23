import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUnutaryProductComponent } from './create-unutary-product.component';
import { MatToolbarModule } from '@angular/material';
import { UnitProductModule } from '@app/secure/products';
import { ShellModule } from '@app/core/shell/shell.module';
import { LoadingService, EndpointService, UserParametersService, CognitoUtil, UserLoginService, DynamoDBService } from '@app/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('CreateUnutaryProductComponent', () => {
  let component: CreateUnutaryProductComponent;
  let fixture: ComponentFixture<CreateUnutaryProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatToolbarModule,
        UnitProductModule,
        ShellModule,
        RouterTestingModule
      ],
      declarations: [ 
        // CreateUnutaryProductComponent 
      ],
      providers: [
        LoadingService,
        EndpointService,
        UserParametersService,
        CognitoUtil,
        UserLoginService,
        DynamoDBService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUnutaryProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    // spyOn(component.router, 'navigate').and.returnValue(true);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
