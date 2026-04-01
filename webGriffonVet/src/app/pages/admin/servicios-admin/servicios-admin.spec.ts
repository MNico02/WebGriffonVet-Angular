import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciosAdmin } from './servicios-admin';

describe('ServiciosAdmin', () => {
  let component: ServiciosAdmin;
  let fixture: ComponentFixture<ServiciosAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiciosAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiciosAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
