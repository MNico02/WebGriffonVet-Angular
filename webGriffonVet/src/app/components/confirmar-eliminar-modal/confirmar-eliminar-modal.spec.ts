import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmarEliminarModal } from './confirmar-eliminar-modal';

describe('ConfirmarEliminarModal', () => {
  let component: ConfirmarEliminarModal;
  let fixture: ComponentFixture<ConfirmarEliminarModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmarEliminarModal],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmarEliminarModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
