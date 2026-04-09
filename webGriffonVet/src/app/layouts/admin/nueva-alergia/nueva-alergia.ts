import { Component, input, output, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HistorialClinicoService } from "../../../core/services/historial-clinico-service";
import {
  alergia,
  alergiaMascotaRequest,
} from "../../../api/models/historialClinico";
import { ChangeDetectorRef } from "@angular/core";
import { ToastService } from "../../../core/services/toast.service";
import { ErrorModalService } from "../../../core/services/error-modal";
@Component({
  selector: "app-nueva-alergia",
  imports: [CommonModule, FormsModule],
  templateUrl: "./nueva-alergia.html",
  styleUrl: "./nueva-alergia.css",
})
export class NuevaAlergia implements OnInit {
  mascotaId = input.required<number>();
  usuarioId = input.required<number>();
  private service = inject(HistorialClinicoService);
  private cdr = inject(ChangeDetectorRef);

  private toast = inject(ToastService);
  private errorModal = inject(ErrorModalService);

  cerrar = output<void>();
  alergiaGuardada = output<void>();

  alergias: alergia[] = [];
  cargandoAlergias = false;

  nuevaAlergiaNombre = "";
  agregandoAlergia = false;

  severidades = ["LEVE", "MODERADA", "GRAVE"];
  mostrarNuevaAlergia = false;
  form: alergiaMascotaRequest = {
    id_mascota: 0,
    id_usuario: 0,
    id_alergia: 0,
    severidad: "",
    observaciones: "",
  };

  ngOnInit() {
    this.cargarAlergias();
  }

  cargarAlergias() {
    this.cargandoAlergias = true;
    this.service.obtenerAlergia().subscribe({
      next: (data: alergia[]) => {
        this.alergias = data;
        this.cargandoAlergias = false;
        this.agregandoAlergia = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.cargandoAlergias = false;
        this.agregandoAlergia = false;
        this.cdr.detectChanges();
        const mensaje =
          err?.error?.mensaje || "No se pudieron cargar las alergias";
        this.errorModal.mostrar(mensaje);
      },
    });
  }

  insertarAlergia() {
    if (!this.nuevaAlergiaNombre.trim()) return;

    this.agregandoAlergia = true;

    const nombre = this.nuevaAlergiaNombre.trim();

    this.service.insertarAlergiaCatalogo(nombre).subscribe({
      next: () => {
        this.nuevaAlergiaNombre = "";
        this.agregandoAlergia = false;

        this.mostrarNuevaAlergia = false;
        this.toast.mostrar("Alergia agregada correctamente");
        this.cargarAlergias();

        setTimeout(() => {
          if (!this.alergias.length) return;

          const ultima = this.alergias.reduce((max, a) =>
            a.id_alergia > max.id_alergia ? a : max,
          );

          this.form.id_alergia = ultima.id_alergia;
        }, 300);
      },
      error: (err) => {
        this.agregandoAlergia = false;
        const mensaje = err?.error?.mensaje || "Error al agregar la alergia";
        this.errorModal.mostrar(mensaje);
      },
    });
  }
  guardar() {
    const payload: alergiaMascotaRequest = {
      ...this.form,
      id_usuario: this.usuarioId(),
      id_mascota: this.mascotaId(),
    };

    console.log("Payload alergia:", payload);

    this.service.insertarAlergia(payload).subscribe({
      next: () => {
        this.toast.mostrar("Alergia registrada correctamente");

        this.alergiaGuardada.emit();
        this.cerrar.emit();
      },
      error: (err) => {
        const mensaje = err?.error?.mensaje || "Error al guardar la alergia";
        this.errorModal.mostrar(mensaje);
      },
    });
  }

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains("modal-overlay")) {
      this.cerrar.emit();
    }
  }
  getSeveridadActivaClass(s: string): string {
    const clases: Record<string, string> = {
      LEVE: "flex-1 py-2 rounded-lg text-xs font-bold border-2 border-tertiary bg-tertiary-container/30 text-tertiary transition-all",
      MEDIA:
        "flex-1 py-2 rounded-lg text-xs font-bold border-2 border-secondary bg-secondary-container/30 text-secondary transition-all",
      ALTA: "flex-1 py-2 rounded-lg text-xs font-bold border-2 border-error bg-error-container/30 text-error transition-all",
    };
    return clases[s] ?? "";
  }
}
