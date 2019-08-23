import { SellerSupportCenterModule } from './seller-support-center.module';

describe('SellerSupportCenterModule', () => {
  let sellerSupportCenterModule: SellerSupportCenterModule;

  beforeEach(() => {
    sellerSupportCenterModule = new SellerSupportCenterModule();
  });

  it('should create an instance', () => {
    expect(sellerSupportCenterModule).toBeTruthy();
  });
});
