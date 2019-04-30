import { TestBed } from '@angular/core/testing';

import { CategoryTreeService } from './category-tree.service';

describe('CategoryTreeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CategoryTreeService = TestBed.get(CategoryTreeService);
    expect(service).toBeTruthy();
  });
});
