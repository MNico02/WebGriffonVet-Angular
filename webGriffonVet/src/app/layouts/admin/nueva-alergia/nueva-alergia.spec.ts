import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaAlergia } from './nueva-alergia';

describe('NuevaAlergia', () => {
  let component: NuevaAlergia;
  let fixture: ComponentFixture<NuevaAlergia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevaAlergia],
    }).compileComponents();

    fixture = TestBed.createComponent(NuevaAlergia);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
