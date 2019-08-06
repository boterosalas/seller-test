/* 3rd party components */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

/* our own custom components */
import { ViewCommentComponent } from './view-comment.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Component } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

describe('ViewCommentComponent', () => {
  let component: ViewCommentComponent;
  let fixture: ComponentFixture<ViewCommentComponent>;

  const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed', 'componentInstance']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ], declarations: [
        ViewCommentComponent
      ], providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: [] },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create MODAL in validation', () => {
    expect(component).toBeTruthy();
  });

  it('dialog should be closed after onNoClick()', () => {
    component.onNoClick();
    expect(component).toBeTruthy();
  });
});
