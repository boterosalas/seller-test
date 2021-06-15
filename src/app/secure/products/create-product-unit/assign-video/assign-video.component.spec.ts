import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignVideoComponent } from './assign-video.component';

describe('AssignVideoComponent', () => {
  let component: AssignVideoComponent;
  let fixture: ComponentFixture<AssignVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
