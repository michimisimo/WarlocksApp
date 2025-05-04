import { TestBed } from '@angular/core/testing';

import { SincronizarUserService } from './sincronizar-user.service';

describe('SincronizarUserService', () => {
  let service: SincronizarUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SincronizarUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
