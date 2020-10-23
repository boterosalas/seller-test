import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCancelsOrdersComponent } from './list-cancels-orders.component';

describe('ListCancelsOrdersComponent', () => {
  let component: ListCancelsOrdersComponent;
  let fixture: ComponentFixture<ListCancelsOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCancelsOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCancelsOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
