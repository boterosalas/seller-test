import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropDownListHeaderComponent } from './drop-down-list-header.component';

describe('DropDownListHeaderComponent', () => {
  let component: DropDownListHeaderComponent;
  let fixture: ComponentFixture<DropDownListHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropDownListHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropDownListHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
