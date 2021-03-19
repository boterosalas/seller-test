import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoModalSupportComponent } from './info-modal-support.component';

describe('InfoModalSupportComponent', () => {
  let component: InfoModalSupportComponent;
  let fixture: ComponentFixture<InfoModalSupportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoModalSupportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoModalSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
