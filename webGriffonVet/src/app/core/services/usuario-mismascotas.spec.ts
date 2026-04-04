import { TestBed } from "@angular/core/testing";

import { UsuarioMismascotas } from "./usuario-mismascotas";

describe("UsuarioMismascotas", () => {
  let service: UsuarioMismascotas;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuarioMismascotas);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
