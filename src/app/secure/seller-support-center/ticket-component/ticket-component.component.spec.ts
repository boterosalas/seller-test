import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketComponentComponent } from './ticket-component.component';

describe('TicketComponentComponent', () => {
  let component: TicketComponentComponent;
  let fixture: ComponentFixture<TicketComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
