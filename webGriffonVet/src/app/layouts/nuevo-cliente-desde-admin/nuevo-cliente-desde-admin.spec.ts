import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NuevoClienteDesdeAdmin } from "./nuevo-cliente-desde-admin";

describe("NuevoClienteDesdeAdmin", () => {
  let component: NuevoClienteDesdeAdmin;
  let fixture: ComponentFixture<NuevoClienteDesdeAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevoClienteDesdeAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(NuevoClienteDesdeAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
