import { TestBed } from '@angular/core/testing';

import { EnfermedadService } from './enfermedad-service';

describe('EnfermedadService', () => {
  let service: EnfermedadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnfermedadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
