import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const dataMock = {
  Id: 11715,
  Name: 'pruebaintegracipon inter v4',
  Nit: 'alkdsjflasfd763839',
  Rut: 'alkdsjflasfd763839',
  ContactName: 'PruebaIntegración v4',
  Email: 'pruebaInter@test.com',
  PhoneNumber: '+86-8493864738',
  Address: 'lkañsjdflaa jasldkf 0484 ',
  State: 'TOKIO',
  City: 'UNA CIUDAD DE CHINA',
  DaneCode: '875dkd43',
  SincoDaneCode: null,
  IsLogisticsExito: false,
  IsShippingExito: true,
  GotoExito: true,
  GotoCarrulla: false,
  GotoCatalogo: true,
  Profile: 'seller',
  Country: 'COLOMBIA',
  Payoneer: '11m3k2k2mmm21',
  IsUpdated: false,
  Policy: null,
  IdSalesForce: null,
  IsProcessSF: false,
  DaneCodesNonCoverage: ['05308000' /** Girardota */, '73861000', '25506000']
};

@Injectable()
export class CitiesCoverageService {
  constructor() { }

  public getDaneCodesNonCoverage(): Observable<string[]> {
    return of(dataMock).pipe(map(item => item.DaneCodesNonCoverage));
  }
}
