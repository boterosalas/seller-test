import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class AgreementService {
    constructor(private http: HttpClient) {}
}
