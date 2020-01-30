import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailCalificationComponent } from './detail-calification.component';

describe('DetailCalificationComponent', () => {
  let component: DetailCalificationComponent;
  let fixture: ComponentFixture<DetailCalificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailCalificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailCalificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
