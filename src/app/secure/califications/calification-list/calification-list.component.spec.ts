import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalificationListComponent } from './calification-list.component';

describe('CalificationListComponent', () => {
  let component: CalificationListComponent;
  let fixture: ComponentFixture<CalificationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalificationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalificationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
