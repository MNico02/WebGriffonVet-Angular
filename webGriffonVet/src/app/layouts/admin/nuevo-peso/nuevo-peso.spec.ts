import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoPeso } from './nuevo-peso';

describe('NuevoPeso', () => {
  let component: NuevoPeso;
  let fixture: ComponentFixture<NuevoPeso>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevoPeso],
    }).compileComponents();

    fixture = TestBed.createComponent(NuevoPeso);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
