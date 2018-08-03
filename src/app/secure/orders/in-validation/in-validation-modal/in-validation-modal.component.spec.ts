/* 3rd party components */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

/* our own custom components */
import { InValidationModule } from '../in-validation.module';
import { InValidationModalComponent } from './in-validation-modal.component';

describe('InValidationModalComponent', () => {
  let component: InValidationModalComponent;
  let fixture: ComponentFixture<InValidationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        InValidationModule,
        RouterTestingModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InValidationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
