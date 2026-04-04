import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaEnfemedad } from './nueva-enfemedad';

describe('NuevaEnfemedad', () => {
  let component: NuevaEnfemedad;
  let fixture: ComponentFixture<NuevaEnfemedad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevaEnfemedad],
    }).compileComponents();

    fixture = TestBed.createComponent(NuevaEnfemedad);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
