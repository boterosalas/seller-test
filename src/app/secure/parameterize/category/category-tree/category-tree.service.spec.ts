import { TestBed, inject } from '@angular/core/testing';

import { CategoryTreeService } from '../category-tree.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

describe('CategoryTreeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    inject([HttpClientTestingModule], (injectService: HttpClient) => {
      const service: CategoryTreeService = TestBed.get(CategoryTreeService);
      expect(service).toBeTruthy();
    });
  });
});
