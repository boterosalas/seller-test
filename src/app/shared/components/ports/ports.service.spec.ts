import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';

import { PortsService } from './ports.service';
import { EndpointService } from '@app/core';
import { HttpClientModule } from '@angular/common/http';
import { PortEntity } from '@app/shared/models';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

describe('PortsService', () => {
  let portsService: PortsService;
  let endpointService: EndpointService;
  let endpoint: string;
  const country = 'PANAMA';

  const listPortsMock: PortEntity[] = [
    {
      Id: 1,
      Name: "Port1"
    },
    {
      Id: 2,
      Name: "Port2"
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [
        PortsService,
        EndpointService,
        HttpTestingController
      ]
    });
    portsService = TestBed.get(PortsService);
    endpointService = TestBed.get(EndpointService);
    endpoint = endpointService.get('getPortsByCountryName', [country])
  });

  it('should be created', () => {
    expect(portsService).toBeTruthy();
    expect(endpointService).toBeTruthy();
  });

  it('Should be able to retrieve posts from the API bia GET',
    inject(
      [HttpTestingController],
      fakeAsync ((httpMock: HttpTestingController) => {

        portsService.getPortByCountryName(country).subscribe(ports => {
          expect(ports.length).toBe(2);
          expect(ports).toEqual(listPortsMock);
      }))
  );
});