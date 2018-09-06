import { OverlayContainer } from '@angular/cdk/overlay';
import { async, inject, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

import { SharedModule } from '@shared/shared.module';

import { ConfirmAlertComponent } from './confirm-alert.component';


describe('ConfirmAlertComponent', () => {
  let dialog: MatDialog;
  let overlayContainer: OverlayContainer;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmAlertComponent],
      imports: [
        SharedModule
      ],
    });
    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [ConfirmAlertComponent]
      }
    });

    TestBed.compileComponents();
  }));

  beforeEach(inject([MatDialog, OverlayContainer],
    (d: MatDialog, oc: OverlayContainer) => {
      dialog = d;
      overlayContainer = oc;
    })
  );
});
