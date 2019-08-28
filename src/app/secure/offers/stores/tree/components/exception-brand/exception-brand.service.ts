import { Injectable } from '@angular/core';
import { EndpointService } from '@app/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExceptionBrandService {

  brands = [
    { Name: 'asdlfasdflk' },
    { Name: 'Hydrogen' },
    { Name: 'Helium' },
    { Name: 'Lithium' },
    { Name: 'Beryllium' },
    { Name: 'Boron' },
    { Name: 'Carbon' },
    { Name: 'Nitrogen' },
    { Name: 'Oxygen' },
    { Name: 'Fluorine' },
    { Name: 'Neon' },
    { Name: 'Neon 2' },
    { Name: 'Neon 3' },
    { Name: 'Neon 4' },
    { Name: 'Neon 5' },
    { Name: 'Neon 6' },
    { Name: 'Neon 7' },
  ];

  constructor(private api: EndpointService, private http: HttpClient) { }

  
}
