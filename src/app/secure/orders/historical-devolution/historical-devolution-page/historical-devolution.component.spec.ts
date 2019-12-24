import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalDevolutionComponent } from './historical-devolution.component';

describe('HistoricalDevolutionComponent', () => {
  let component: HistoricalDevolutionComponent;
  let fixture: ComponentFixture<HistoricalDevolutionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricalDevolutionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricalDevolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
