import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalExportToReclaimComponent } from './modal-export-to-reclaim.component';

import { MaterialModule } from '@app/material.module';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '@app/shared/shared.module';
import { SortDirection, MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatSnackBarModule } from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormBuilder, FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { EndpointService, LoadingService } from '@app/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { StoreService } from '@app/store/store.service';
import { ConfigurationState } from '@app/store/configuration';


class StoreTest {
  select(): Observable<any> {
    return of(
      {
        notification: {
          unreadCases: 2
        }
      }
    );
  }
}

class StoreServiceTest {
  getStateConfiguration() {
    const configurationState: ConfigurationState = { language: 'US', statusCases: [] };
    return of({
      appConfiguration: configurationState,
      configuration: { modules: [] },
      notification: {
        sumaUnreadDevolutions: 2,
        unreadCases: 2,
        unreadDevolutions: 2,
        unreadPendings: 2
      }
    });
  }
}

describe('ModalExportToReclaimComponent', () => {
  let component: ModalExportToReclaimComponent;
  let fixture: ComponentFixture<ModalExportToReclaimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        SharedModule,
        MatSnackBarModule
      ],
      declarations: [ ModalExportToReclaimComponent ],
      providers: [
        EndpointService,
        LoadingService,
        { provide: Store, useClass: StoreTest },
        { provide: StoreService, useClass: StoreServiceTest },
      ]
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


