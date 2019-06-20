import { TestBed } from '@angular/core/testing';

import { SellerSupportCenterService } from './seller-support-center.service';

describe('SellerSupportCenterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SellerSupportCenterService = TestBed.get(SellerSupportCenterService);
    expect(service).toBeTruthy();
  });
});
