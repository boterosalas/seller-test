import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeCategoriesComponent } from './tree-categories.component';

describe('TreeCategoriesComponent', () => {
  let component: TreeCategoriesComponent;
  let fixture: ComponentFixture<TreeCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreeCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
