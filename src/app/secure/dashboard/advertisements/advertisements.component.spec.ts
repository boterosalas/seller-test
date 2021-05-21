import { DatePipe } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EndpointService, LoadingService } from '@app/core';
import { MaterialModule } from '@app/material.module';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { DashboardService } from '../services/dashboard.service';

import { AdvertisementsComponent } from './advertisements.component';

describe('AdvertisementsComponent', () => {
  let component: AdvertisementsComponent;
  let fixture: ComponentFixture<AdvertisementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvertisementsComponent ],
      imports:[
        MaterialModule,
        SharedModule,
        TranslateModule.forRoot()
      ],
      providers: [
        DatePipe,
        DashboardService,
        EndpointService,
        LoadingService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvertisementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
