import { TestBed } from '@angular/core/testing';

import { PortsService } from './ports.service';
import { EndpointService } from '@app/core';

describe('PortsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const portsService: PortsService = TestBed.get(PortsService);
    const endpointService: EndpointService = TestBed.get(EndpointService);
    expect(portsService).toBeTruthy();
    expect(endpointService).toBeTruthy();
  });
});
