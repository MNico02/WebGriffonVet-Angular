import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Activar } from "./activar";

describe("Activar", () => {
  let component: Activar;
  let fixture: ComponentFixture<Activar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Activar],
    }).compileComponents();

    fixture = TestBed.createComponent(Activar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
