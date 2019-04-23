import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateEanComponent } from './validate-ean.component';
import { UnitProductModule } from '@app/secure/products';
import { ShellModule } from '@app/core/shell/shell.module';
import { EndpointService } from '@app/core';
import { MatStepperModule, MatStepper } from '@angular/material';
import { ChangeDetectorRef, ElementRef, Injectable } from '@angular/core';

@Injectable()
export class MockElementRef {
  nativeElement: {}  
}

describe('ValidateEanComponent', () => {
  let component: ValidateEanComponent;
  let fixture: ComponentFixture<ValidateEanComponent>;
  

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        UnitProductModule,
        ShellModule,
        // MatStepperModule
      ],
      declarations: [ 
        // ValidateEanComponent
       ],
       providers:[
        EndpointService,
        MatStepper,
        ChangeDetectorRef,
        { provide: ElementRef, useClass: MockElementRef }
       ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateEanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

