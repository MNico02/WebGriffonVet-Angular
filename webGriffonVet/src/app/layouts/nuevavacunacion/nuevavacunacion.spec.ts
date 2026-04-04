import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Nuevavacunacion } from './nuevavacunacion';

describe('Nuevavacunacion', () => {
  let component: Nuevavacunacion;
  let fixture: ComponentFixture<Nuevavacunacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Nuevavacunacion],
    }).compileComponents();

    fixture = TestBed.createComponent(Nuevavacunacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
