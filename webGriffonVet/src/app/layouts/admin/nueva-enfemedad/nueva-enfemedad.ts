import { Component, input, output, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HistorialClinicoService } from "../../../core/services/historial-clinico-service";
import {
  enfermedad,
  enfermedadMascotaRequest,
} from "../../../api/models/historialClinico";
import { ChangeDetectorRef } from "@angular/core";
import { ToastService } from "../../../core/services/toast.service";
import { ErrorModalService } from "../../../core/services/error-modal";
@Component({
  selector: "app-nueva-enfermedad",
  imports: [CommonModule, FormsModule],
  templateUrl: "./nueva-enfemedad.html",
  styleUrl: "./nueva-enfemedad.css",
})
export class NuevaEnfermedad implements OnInit {
  mascotaId = input.required<number>();
  usuarioId = input.required<number>();
  private enfermedadService = inject(HistorialClinicoService);
  private cdr = inject(ChangeDetectorRef);
  private toast = inject(ToastService);
  private errorModal = inject(ErrorModalService);
  cerrar = output<void>();
  enfermedadGuardada = output<void>();

  enfermedades: enfermedad[] = [];
  cargandoEnfermedades = false;

  nuevaEnfermedadNombre = "";
  agregandoEnfermedad = false;
  mostrarNuevaEnfermedad = false;
  estados = ["ACTIVA", "CURADA", "CRONICA"];

  form: enfermedadMascotaRequest = {
    id_mascota: 0,
    id_usuario: 0,
    id_enfermedad: 0,
    estado: "",
    fecha_diagnostico: "",
    observaciones: "",
  };

  ngOnInit() {
    this.cargarEnfermedades();
  }

  cargarEnfermedades() {
    this.cargandoEnfermedades = true;
    this.enfermedadService.obtenerEnfermedades().subscribe({
      next: (data: enfermedad[]) => {
        this.enfermedades = data;
        this.cargandoEnfermedades = false;
        this.agregandoEnfermedad = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.cargandoEnfermedades = false;
        this.agregandoEnfermedad = false;
        this.cdr.detectChanges();
        const mensaje =
          err?.error?.mensaje || "No se pudieron cargar las enfermedades";
        this.errorModal.mostrar(mensaje);
      },
    });
  }

  insertarEnfermedad() {
    if (!this.nuevaEnfermedadNombre.trim()) return;

    this.agregandoEnfermedad = true;

    const nombre = this.nuevaEnfermedadNombre.trim();

    this.enfermedadService.insertarEnfermedadCatalogo(nombre).subscribe({
      next: () => {
        this.nuevaEnfermedadNombre = "";
        this.agregandoEnfermedad = false;
        this.mostrarNuevaEnfermedad = false;

        this.toast.mostrar("Enfermedad agregada correctamente");

        this.cargarEnfermedades();

        setTimeout(() => {
          if (!this.enfermedades.length) return;

          const ultima = this.enfermedades.reduce((max, e) =>
            e.id_enfermedad > max.id_enfermedad ? e : max,
          );

          this.form.id_enfermedad = ultima.id_enfermedad;
        }, 300);
      },

      error: (err) => {
        this.agregandoEnfermedad = false;

        const mensaje = err?.error?.mensaje || "Error al agregar la enfermedad";
        this.errorModal.mostrar(mensaje);
      },
    });
  }

  guardar() {
    const payload: enfermedadMascotaRequest = {
      ...this.form,
      id_usuario: this.usuarioId(),
      id_mascota: this.mascotaId(),
    };

    console.log("Payload enfermedad:", payload);

    this.enfermedadService.insertarEnfermedad(payload).subscribe({
      next: () => {
        this.toast.mostrar("Enfermedad registrada correctamente");

        this.enfermedadGuardada.emit();
        this.cerrar.emit();
      },
      error: (err) => {
        const mensaje = err?.error?.mensaje || "Error al guardar la enfermedad";
        this.errorModal.mostrar(mensaje);
      },
    });
  }

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains("modal-overlay")) {
      this.cerrar.emit();
    }
  }
}
