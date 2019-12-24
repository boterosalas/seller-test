import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndpointService } from '@app/core';
import { Observable } from 'rxjs';

@Injectable()
export class HistoricalDevolutionService {
    constructor(private http: HttpClient, private api: EndpointService) {}
}
