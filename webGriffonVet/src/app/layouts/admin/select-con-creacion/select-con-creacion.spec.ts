import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectConCreacion } from './select-con-creacion';

describe('SelectConCreacion', () => {
  let component: SelectConCreacion;
  let fixture: ComponentFixture<SelectConCreacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectConCreacion],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectConCreacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
