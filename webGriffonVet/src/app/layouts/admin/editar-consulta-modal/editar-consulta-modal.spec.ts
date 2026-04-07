import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EditarConsultaModal } from "./editar-consulta-modal";

describe("EditarConsultaModal", () => {
  let component: EditarConsultaModal;
  let fixture: ComponentFixture<EditarConsultaModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarConsultaModal],
    }).compileComponents();

    fixture = TestBed.createComponent(EditarConsultaModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
