import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MaterialModule } from '@app/material.module';
import { TranslateModule } from '@ngx-translate/core';

import { EditItemModuleComponent } from './edit-item-module.component';

describe('EditItemModuleComponent', () => {
  let component: EditItemModuleComponent;
  let fixture: ComponentFixture<EditItemModuleComponent>;

  const mockDialog = jasmine.createSpyObj("MatDialogRef", [
    "open, close, afterClosed",
  ]);
  let data = {};


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditItemModuleComponent ],
      imports: [MaterialModule, TranslateModule.forRoot({})],
      providers: [
        { provide: MatDialogRef, useValue: mockDialog },
        { provide: MAT_DIALOG_DATA, useValue: data }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditItemModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
