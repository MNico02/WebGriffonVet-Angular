import { Component, Input, Output, EventEmitter } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { HistorialClinicoService } from "../../../core/services/historial-clinico-service";
import { inject } from "@angular/core";
import { ToastService } from "../../../core/services/toast.service";
import { ErrorModalService } from "../../../core/services/error-modal";

@Component({
  selector: "app-editar-consulta-modal",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./editar-consulta-modal.html",
})
export class EditarConsultaModal {
  private toast = inject(ToastService);
  private errorModal = inject(ErrorModalService);

  @Input() consulta: any;
  @Output() cerrar = new EventEmitter();
  @Output() consultaActualizada = new EventEmitter();

  form: any = {};

  nuevoEstudio = {
    tipo_estudio: "",
    observaciones: "",
  };

  archivos: File[] = [];
  archivoSeleccionadoNombre = "";

  constructor(private historialService: HistorialClinicoService) {}

  ngOnInit() {
    this.form = JSON.parse(JSON.stringify(this.consulta));

    if (!this.form.estudios) {
      this.form.estudios = [];
    }
  }

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains("modal-overlay")) {
      this.cerrar.emit();
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.archivos.push(file);
      this.archivoSeleccionadoNombre = file.name;
    }
  }

  agregarEstudio() {
    if (!this.nuevoEstudio.tipo_estudio) return;

    this.form.estudios.push({
      tipo_estudio: this.nuevoEstudio.tipo_estudio,
      observaciones: this.nuevoEstudio.observaciones,
      resultado: "",
    });

    this.nuevoEstudio = { tipo_estudio: "", observaciones: "" };
    this.archivoSeleccionadoNombre = "";
  }

  guardar() {
    const formData = new FormData();

    formData.append("consulta", JSON.stringify(this.form));

    this.archivos.forEach((f) => {
      formData.append("archivos", f);
    });

    this.historialService.editarConsulta(formData).subscribe({
      next: () => {
        // ✅ TOAST ÉXITO
        this.toast.mostrar("Consulta actualizada correctamente");

        this.consultaActualizada.emit();
        this.cerrar.emit();
      },

      error: (err) => {
        console.error(err);

        // ❌ MODAL ERROR (mensaje del backend)
        const mensaje =
          err?.error?.mensaje || "Error al actualizar la consulta";

        this.errorModal.mostrar(mensaje);
      },
    });
  }
  eliminarEstudio(index: number) {
    this.form.estudios.splice(index, 1);
  }
}
