import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseFilterComponent } from './case-filter.component';
import { MaterialModule } from '@app/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material';
import { NgModule } from '@angular/core';

describe('CaseFilterComponent', () => {
  let component: CaseFilterComponent;
  let fixture: ComponentFixture<CaseFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CaseFilterModuleTest,
        TranslateModule.forRoot({}),
      ],
      providers: []
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset form', () => {
    component.cleanFilter();
    const isDirty = component.filterForm.dirty;
    expect(isDirty).toBeFalsy()
  });

  it('should option be empty', () => {
    expect(component.options.length).toBe(0)
  });

  it('should lastPost to have 2 elements', () => {
    expect(component.lastPost.length).toBe(2)
  });

  it('should emit response', () => {
    spyOn(component.eventFilter, 'emit')
    component.value = "Value_post_test";
    fixture.detectChanges();
    component.ngOnInit();
    component.submitFilter();
    expect(component.eventFilter.emit).toHaveBeenCalled();
  });

});

@NgModule({
  declarations: [
    CaseFilterComponent
  ],
  imports: [
    MaterialModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    RouterTestingModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({}),
  ],
  exports: [
    CaseFilterComponent
  ]
})
export class CaseFilterModuleTest {

}
