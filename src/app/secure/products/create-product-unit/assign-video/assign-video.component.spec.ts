import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EndpointService, LoadingService } from '@app/core';
import { MaterialModule } from '@app/material.module';
import { ComponentsService } from '@app/shared';
import { TranslateModule } from '@ngx-translate/core';
import { ProcessService } from '../component-process/component-process.service';
import { AssignVideoComponent } from './assign-video.component';


describe('AssignVideoComponent', () => {
  let component: AssignVideoComponent;
  let fixture: ComponentFixture<AssignVideoComponent>;

  const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
  const mockProcessService = jasmine.createSpyObj('ProcessService', ['change', 'showView', 'getViews', 'setViews', 'getProductData']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignVideoComponent ],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        TranslateModule.forRoot(),
        MaterialModule,
        HttpClientTestingModule,
        BrowserAnimationsModule
      ],
      providers: [
        ComponentsService,
        EndpointService,
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: ProcessService, useValue: mockProcessService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
