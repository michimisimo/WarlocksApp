import { TestBed } from '@angular/core/testing';

import { VersionMiembrosService } from './version-miembros.service';

describe('VersionMiembrosService', () => {
  let service: VersionMiembrosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VersionMiembrosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
