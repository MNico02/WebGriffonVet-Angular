import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaDesparasitacion } from './nueva-desparasitacion';

describe('NuevaDesparasitacion', () => {
  let component: NuevaDesparasitacion;
  let fixture: ComponentFixture<NuevaDesparasitacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevaDesparasitacion],
    }).compileComponents();

    fixture = TestBed.createComponent(NuevaDesparasitacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
