import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashOrdersComponent } from './dash-orders.component';

describe('DashOrdersComponent', () => {
  let component: DashOrdersComponent;
  let fixture: ComponentFixture<DashOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
