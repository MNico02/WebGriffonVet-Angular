import { Component, input, output, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {
  NuevoTratamientoRequest,
  NuevaConsultaRequest,
} from "../../../api/models/historialClinico";
import { HistorialClinicoService } from "../../../core/services/historial-clinico-service";
import { Medicamento } from "../../../api/models/historialClinico";

import { ToastService } from "../../../core/services/toast.service";
import { ErrorModalService } from "../../../core/services/error-modal";
import { ChangeDetectorRef } from "@angular/core";

export interface NuevoEstudioRequest {
  tipo_estudio: string;
  resultado: string;
  observaciones: string;
}

@Component({
  selector: "app-nueva-consulta-modal",
  imports: [CommonModule, FormsModule],
  templateUrl: "./nueva-consulta.html",
  styleUrl: "./nueva-consulta.css",
})
export class NuevaConsulta implements OnInit {
  mascotaId = input.required<number>();
  usuarioId = input.required<number>();
  private service = inject(HistorialClinicoService);

  private toast = inject(ToastService);
  private errorModal = inject(ErrorModalService);
  private cdr = inject(ChangeDetectorRef);
  cerrar = output<void>();
  consultaGuardada = output<void>();

  // Lista de medicamentos disponibles
  medicamentos: Medicamento[] = [];
  cargandoMedicamentos = false;

  // Para agregar un medicamento nuevo al sistema
  nuevoMedicamentoNombre = "";
  agregandoMedicamento = false;

  archivoSeleccionado: File | null = null;
  archivoSeleccionadoNombre = "";
  mostrarNuevoMedicamento = false;
  form: NuevaConsultaRequest = {
    id_usuario: 0,
    id_mascota: 0,
    motivo_consulta: "",
    anamnesis: "",
    examen_general: "",
    diagnostico_presuntivo: "",
    diagnostico: "",
    tratamiento: "",
    observaciones: "",
    tratamientos: [],
    estudios: [],
    archivos: [],
  };

  nuevoTratamiento: NuevoTratamientoRequest = {
    id_medicamento: 0,
    nombre_medicamento: "",
    dosis: "",
    frecuencia: "",
    duracion_dias: 0,
    indicaciones: "",
  };

  nuevoEstudio: NuevoEstudioRequest = {
    tipo_estudio: "",
    resultado: "",
    observaciones: "",
  };

  ngOnInit() {
    this.cargarMedicamentos();
  }

  cargarMedicamentos() {
    this.cargandoMedicamentos = true;
    this.service.obtenerMedicamentos().subscribe({
      next: (data: Medicamento[]) => {
        this.medicamentos = data;
        this.cargandoMedicamentos = false;
        this.agregandoMedicamento = false; // ← acá, no antes
        this.cdr.detectChanges();
      },
      error: () => {
        this.cargandoMedicamentos = false;
        this.agregandoMedicamento = false;
        this.cdr.detectChanges();
      },
    });
  }

  onMedicamentoSeleccionado() {
    const med = this.medicamentos.find(
      (m) => m.id_medicamento === +this.nuevoTratamiento.id_medicamento,
    );
    if (med) {
      this.nuevoTratamiento.nombre_medicamento = med.nombre;
    }
  }

  insertarMedicamento() {
    if (!this.nuevoMedicamentoNombre.trim()) return;

    this.agregandoMedicamento = true;

    const nombre = this.nuevoMedicamentoNombre.trim();

    this.service.insertarMedicamento(nombre).subscribe({
      next: () => {
        this.nuevoMedicamentoNombre = "";
        this.agregandoMedicamento = false;

        this.mostrarNuevoMedicamento = false;

        this.cargarMedicamentos();

        setTimeout(() => {
          if (!this.medicamentos.length) return;

          const ultimo = this.medicamentos.reduce((max, m) =>
            m.id_medicamento > max.id_medicamento ? m : max,
          );

          this.nuevoTratamiento.id_medicamento = ultimo.id_medicamento;
          this.nuevoTratamiento.nombre_medicamento = ultimo.nombre;
        }, 300);
      },
      error: () => {
        this.agregandoMedicamento = false;
      },
    });
  }

  agregarTratamiento() {
    if (!this.nuevoTratamiento.id_medicamento) return;
    this.form.tratamientos.push({ ...this.nuevoTratamiento });
    this.nuevoTratamiento = {
      id_medicamento: 0,
      nombre_medicamento: "",
      dosis: "",
      frecuencia: "",
      duracion_dias: 0,
      indicaciones: "",
    };
  }

  eliminarTratamiento(index: number) {
    this.form.tratamientos.splice(index, 1);
  }

  agregarEstudio() {
    if (!this.nuevoEstudio.tipo_estudio.trim()) return;

    this.form.estudios.push({
      ...this.nuevoEstudio,
      archivo: this.archivoSeleccionado, // 👈 clave
    });

    this.nuevoEstudio = {
      tipo_estudio: "",
      resultado: "",
      observaciones: "",
    };

    this.archivoSeleccionado = null;
    this.archivoSeleccionadoNombre = "";
  }

  eliminarEstudio(index: number) {
    this.form.estudios.splice(index, 1);
  }

  guardar() {
    const formData = new FormData();

    const estudiosSinArchivo = this.form.estudios.map((e: any) => {
      if (e.archivo) {
        formData.append("archivos", e.archivo);
      }

      return {
        tipo_estudio: e.tipo_estudio,
        resultado: e.resultado || "",
        observaciones: e.observaciones,
      };
    });

    const payload = {
      ...this.form,
      estudios: estudiosSinArchivo,
      id_usuario: this.usuarioId(),
      id_mascota: this.mascotaId(),
    };

    formData.append("consulta", JSON.stringify(payload));

    this.service.crearConsulta(formData).subscribe({
      next: () => {
        // ✅ TOAST ÉXITO
        this.toast.mostrar("Consulta creada correctamente");

        this.consultaGuardada.emit();
        this.cerrar.emit();
      },

      error: (err) => {
        console.error(err);

        // ❌ MODAL ERROR
        const mensaje = err?.error?.mensaje || "Error al crear la consulta";
        this.errorModal.mostrar(mensaje);
      },
    });
  }

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains("modal-overlay")) {
      this.cerrar.emit();
    }
  }
  autoResize(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;

    textarea.style.height = "auto"; // reset
    textarea.style.height = textarea.scrollHeight + "px"; // crecer
  }
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.archivoSeleccionado = file;
      this.archivoSeleccionadoNombre = file.name;
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();

    if (event.dataTransfer?.files.length) {
      const file = event.dataTransfer.files[0];
      this.archivoSeleccionado = file;
      this.archivoSeleccionadoNombre = file.name;
    }
  }
}
