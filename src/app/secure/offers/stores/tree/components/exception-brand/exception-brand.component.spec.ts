import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExceptionBrandComponent } from './exception-brand.component';

describe('ExceptionBrandComponent', () => {
  let component: ExceptionBrandComponent;
  let fixture: ComponentFixture<ExceptionBrandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExceptionBrandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExceptionBrandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
