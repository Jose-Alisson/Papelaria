import { TestBed } from '@angular/core/testing';

import { AuthenticationHeaderInterceptorService } from './authentication-header-interceptor.service';

describe('AuthenticationHeaderInterceptorService', () => {
  let service: AuthenticationHeaderInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthenticationHeaderInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
