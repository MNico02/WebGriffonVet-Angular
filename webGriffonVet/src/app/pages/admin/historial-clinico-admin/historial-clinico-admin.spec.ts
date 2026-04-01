import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialClinicoAdmin } from './historial-clinico-admin';

describe('HistorialClinicoAdmin', () => {
  let component: HistorialClinicoAdmin;
  let fixture: ComponentFixture<HistorialClinicoAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialClinicoAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(HistorialClinicoAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
