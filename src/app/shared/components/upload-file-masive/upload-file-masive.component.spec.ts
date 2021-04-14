import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFileMasiveComponent } from './upload-file-masive.component';

describe('UploadFileMasiveComponent', () => {
  let component: UploadFileMasiveComponent;
  let fixture: ComponentFixture<UploadFileMasiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadFileMasiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadFileMasiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
