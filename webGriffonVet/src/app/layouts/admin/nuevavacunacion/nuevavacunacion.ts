import {
  Component,
  input,
  output,
  signal,
  inject,
  OnInit,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HistorialClinicoService } from "../../../core/services/historial-clinico-service";
import { Vacuna } from "../../../api/models/historialClinico";
import { NuevaVacunacionRequest } from "../../../api/models/historialClinico";
import { ChangeDetectorRef } from "@angular/core";
import { ToastService } from "../../../core/services/toast.service";
import { ErrorModalService } from "../../../core/services/error-modal";
@Component({
  selector: "app-nueva-vacunacion-modal",
  imports: [CommonModule, FormsModule],
  templateUrl: "./nuevavacunacion.html",
  styleUrl: "./nuevavacunacion.css",
})
export class NuevaVacunacion implements OnInit {
  mascotaId = input.required<number>();
  usuarioId = input.required<number>();
  private vacunacionService = inject(HistorialClinicoService);
  private cdr = inject(ChangeDetectorRef);
  private toast = inject(ToastService);
  private errorModal = inject(ErrorModalService);
  cerrar = output<void>();
  vacunacionGuardada = output<void>();

  vacunas: Vacuna[] = [];
  cargandoVacunas = false;

  nuevaVacunaNombre = "";
  agregandoVacuna = false;
  mostrarNuevaVacuna = signal(false);
  form: NuevaVacunacionRequest = {
    id_mascota: 0,
    id_usuario: 0,
    id_vacuna: 0,
    nombre_vacuna: "",
    fecha_aplicacion: "",
    proxima_dosis: "",
    observaciones: "",
  };

  ngOnInit() {
    this.cargarVacunas();
  }

  cargarVacunas() {
    this.cargandoVacunas = true;
    this.vacunacionService.obtenerVacunas().subscribe({
      next: (data: Vacuna[]) => {
        this.vacunas = [...data];
        this.cargandoVacunas = false;
        this.agregandoVacuna = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.cargandoVacunas = false;
        this.agregandoVacuna = false;
        this.cdr.detectChanges();
        const mensaje =
          err?.error?.mensaje || "No se pudieron cargar las vacunas";
        this.errorModal.mostrar(mensaje);
      },
    });
  }

  onVacunaSeleccionada(id: number) {
    console.log("id recibido:", id);
    console.log("vacunas disponibles:", this.vacunas);
    const vac = this.vacunas.find((v) => v.id_vacuna === +id);
    console.log("vacuna encontrada:", vac);
    if (vac) {
      this.form.nombre_vacuna = vac.nombre;
    }
  }
  insertarVacuna() {
    if (!this.nuevaVacunaNombre.trim()) return;

    this.agregandoVacuna = true;

    this.vacunacionService
      .insertarVacuna(this.nuevaVacunaNombre.trim())
      .subscribe({
        next: () => {
          this.nuevaVacunaNombre = "";
          this.agregandoVacuna = false;
          this.mostrarNuevaVacuna.set(false);

          this.toast.mostrar("Vacuna agregada correctamente");

          this.cargarVacunas();

          setTimeout(() => {
            if (!this.vacunas.length) return;

            const ultima = this.vacunas.reduce((max, v) =>
              v.id_vacuna > max.id_vacuna ? v : max,
            );

            if (ultima) {
              this.form.id_vacuna = ultima.id_vacuna;
              this.form.nombre_vacuna = ultima.nombre;
            }
          }, 300);
        },

        error: (err) => {
          this.agregandoVacuna = false;

          const mensaje = err?.error?.mensaje || "Error al agregar la vacuna";
          this.errorModal.mostrar(mensaje);
        },
      });
  }

  guardar() {
    console.log("form completo:", this.form);
    const payload: NuevaVacunacionRequest = {
      ...this.form,
      id_usuario: this.usuarioId(),
      id_mascota: this.mascotaId(),
    };

    console.log("Payload vacunación:", payload);

    this.vacunacionService.insertarVacunacion(payload).subscribe({
      next: () => {
        this.toast.mostrar("Vacunación registrada correctamente");

        this.vacunacionGuardada.emit();
        this.cerrar.emit();
      },
      error: (err) => {
        const mensaje = err?.error?.mensaje || "Error al guardar la vacunación";
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
