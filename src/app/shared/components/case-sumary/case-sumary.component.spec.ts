import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseSumaryComponent } from './case-sumary.component';

describe('CaseSumaryComponent', () => {
  let component: CaseSumaryComponent;
  let fixture: ComponentFixture<CaseSumaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseSumaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseSumaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
