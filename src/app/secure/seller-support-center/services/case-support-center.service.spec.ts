import { TestBed } from '@angular/core/testing';

import { CaseSupportCenterService } from './case-support-center.service';

describe('CaseSupportCenterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CaseSupportCenterService = TestBed.get(CaseSupportCenterService);
    expect(service).toBeTruthy();
  });
});
