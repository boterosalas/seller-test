// import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';
import { NgModule } from '@angular/core';
import { CoreStoreModule } from '../';
//import { SellerSupportMockService } from '@app/secure/seller-support-center/services/test-mocks/seller-support-mock.service';
import { SellerSupportCenterService } from '@app/secure/seller-support-center/services/seller-support-center.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@NgModule({
  imports: [CoreStoreModule],
  providers: [
    //{ provide: SellerSupportCenterService, useClass: SellerSupportMockService },
    { provide: HttpClient, useClass: HttpClientTestingModule }
  ]
})
export class StoreTestModule {

}
