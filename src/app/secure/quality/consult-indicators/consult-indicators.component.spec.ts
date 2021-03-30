import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultIndicatorsComponent } from './consult-indicators.component';

describe('ConsultIndicatorsComponent', () => {
  let component: ConsultIndicatorsComponent;
  let fixture: ComponentFixture<ConsultIndicatorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultIndicatorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultIndicatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
