/* import { TestBed, async, inject } from '@angular/core/testing';
import { StoreService } from './store.service';
import { CoreStoreModule } from '.';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigurationState } from './configuration';
import { StoreTestModule } from './store-test-module';
import { SellerSupportMockService } from '@app/secure/seller-support-center/services/test-mocks/seller-support-mock.service';
import { HttpClientModule } from '@angular/common/http';

describe('Service: Store', () => {

  let storeService: StoreService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [StoreTestModule],
      providers: [
        StoreService
      ]
    }).compileComponents();

    storeService = TestBed.get(StoreService);
  }));

  it('Store initialization', (done: DoneFn) => {
    storeService.getStateConfiguration().subscribe(s => {
      expect(s.language).toBe('ES');
      expect(Array.isArray(s.statusCases)).toBeTruthy(true);
      expect(s.statusCases.length).toBe(0);
      done();
    });
  });

  it('Should change the lenguage of appConfiguration', (done: DoneFn) => {
    storeService.changeLanguage('US');
    storeService.getStateConfiguration().subscribe((s: ConfigurationState) => {
      console.log(s);
      expect(s.language).toBe('US');
      done();
    });
  });

     describe('enviroment for change statusArray', () => {
      let storeMockService: StoreTestModule;

      TestBed.configureTestingModule({
        imports: [StoreTestModule],
        providers: [
          SellerSupportMockService,
          HttpClientModule
        ]
      });

      it('Should get the statusArray', (done: DoneFn) => {

      });

    });

});
 */
