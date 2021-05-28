import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EndpointService, LoadingService } from '@app/core';
import { MaterialModule } from '@app/material.module';
import { MyProfileService } from '@app/secure/aws-cognito/profile/myprofile.service';
import { SellerSupportCenterService } from '@app/secure/seller-support-center/services/seller-support-center.service';
import { SupportService } from '@app/secure/support-modal/support.service';
import { EventEmitterSeller } from '@app/shared/events/eventEmitter-seller.service';
import { SharedModule } from '@app/shared/shared.module';
import { StoreService } from '@app/store/store.service';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import { SellerContactsComponent } from './seller-contacts.component';
import { SellerContactsService } from './seller-contacts.service';

describe('SellerContactsComponent', () => {
  let component: SellerContactsComponent;
  let fixture: ComponentFixture<SellerContactsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellerContactsComponent ],
      imports:[
        SharedModule,
        TranslateModule.forRoot(),
        MaterialModule,
        ReactiveFormsModule,
        FormsModule,
        StoreModule.forRoot({})
      ],
      providers: [
        EventEmitterSeller,
        EndpointService,
        SellerSupportCenterService,
        LoadingService,
        StoreService,
        SupportService,
        MyProfileService,
        SellerContactsService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
