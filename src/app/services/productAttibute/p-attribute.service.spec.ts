import { TestBed } from '@angular/core/testing';

import { PAttributeService } from './p-attribute.service';

describe('PAttributeService', () => {
  let service: PAttributeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PAttributeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
