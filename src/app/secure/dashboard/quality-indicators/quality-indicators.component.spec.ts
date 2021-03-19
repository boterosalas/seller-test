import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QualityIndicatorsComponent } from './quality-indicators.component';

describe('QualityIndicatorsComponent', () => {
  let component: QualityIndicatorsComponent;
  let fixture: ComponentFixture<QualityIndicatorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QualityIndicatorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QualityIndicatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
