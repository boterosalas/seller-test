import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalExportToReclaimComponent } from './modal-export-to-reclaim.component';

describe('ModalExportToReclaimComponent', () => {
  let component: ModalExportToReclaimComponent;
  let fixture: ComponentFixture<ModalExportToReclaimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalExportToReclaimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalExportToReclaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
