import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadCategoriesComponent } from './download-categories.component';

describe('DownloadCategoriesComponent', () => {
  let component: DownloadCategoriesComponent;
  let fixture: ComponentFixture<DownloadCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
