import { TestBed } from '@angular/core/testing';

import { AlergiaService } from './alergia-service';

describe('AlergiaService', () => {
  let service: AlergiaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlergiaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
