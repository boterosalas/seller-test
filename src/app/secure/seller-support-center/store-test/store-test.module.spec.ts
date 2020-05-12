import { StoreTestModule } from './store-test.module';

describe('StoreTestModule', () => {
  let storeTestModule: StoreTestModule;

  beforeEach(() => {
    storeTestModule = new StoreTestModule();
  });

  it('should create an instance', () => {
    expect(storeTestModule).toBeTruthy();
  });
});
