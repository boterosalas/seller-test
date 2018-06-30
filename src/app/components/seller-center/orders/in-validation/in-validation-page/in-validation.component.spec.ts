/* 3rd party components */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

/* our own custom components */
import { InValidationComponent } from './in-validation.component';
import { InValidationModule } from '../in-validation.module';

describe('InValidationComponent', () => {
  let component: InValidationComponent;
  let fixture: ComponentFixture<InValidationComponent>;

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
    fixture = TestBed.createComponent(InValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
