/* 3rd party components */
import { MatDialog } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import { async, TestBed, inject } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material';
import { MaterialModule } from '../material-components';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

/* our own custom components */
import { ConfirmAlertComponent } from './confirm-alert.component';

describe('ConfirmAlertComponent', () => {
  let dialog: MatDialog;
  let overlayContainer: OverlayContainer;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmAlertComponent],
      imports: [MaterialModule, MatDialogModule],
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
