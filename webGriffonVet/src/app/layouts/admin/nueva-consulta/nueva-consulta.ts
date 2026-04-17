import { Component, input, output, inject, OnInit, signal, computed } from "@angular/core";
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
import { ItemSeleccionable } from "../../../api/models/itemSeleccionable";
import { SelectConCreacion } from "../select-con-creacion/select-con-creacion";

export interface NuevoEstudioRequest {
  tipo_estudio: string;
  resultado: string;
  observaciones: string;
}

@Component({
  selector: "app-nueva-consulta-modal",
  imports: [CommonModule, FormsModule, SelectConCreacion],
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
  medicamentos = signal<Medicamento[]>([]);
  cargandoMedicamentos= signal(false);
  idMedicamentoSeleccionado = signal<number>(0);
  // Para agregar un medicamento nuevo al sistema
  nuevoMedicamentoNombre = "";
  agregandoMedicamento = false;
  MedicamentosComoItems = computed(() =>
    this.medicamentos().map(c => ({ id: c.id_medicamento, nombre: c.nombre }))
  );
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
    this.cargandoMedicamentos.set(true);
    this.service.obtenerMedicamentos().subscribe({
      next: (data: Medicamento[]) => {
        this.medicamentos.set(data ?? []);
        this.cargandoMedicamentos.set(false);
        this.agregandoMedicamento = false; // ← acá, no antes
        this.cdr.detectChanges();
      },
      error: () => {
        this.cargandoMedicamentos.set(false);
        this.agregandoMedicamento = false;
        this.cdr.detectChanges();
      },
    });
  }

  onMedicamentoSeleccionado(item: ItemSeleccionable) {
    const med = this.medicamentos().find(
      (m) => m.id_medicamento === Number(item.id),
    );
    this.nuevoTratamiento.id_medicamento = Number(item.id);
    this.nuevoTratamiento.nombre_medicamento = med?.nombre ?? item.nombre ?? "";
  }
 
  // Cuando el usuario escribe uno nuevo y lo crea
  onNuevoMedicamento(nombre: string) {
    this.agregandoMedicamento=true;
    const idsAntes = this.medicamentos().map((m) => m.id_medicamento);
 
    this.service.insertarMedicamento(nombre).subscribe({
      next: () => {
        this.toast.mostrar("Medicamento agregado correctamente");
        this.service.obtenerMedicamentos().subscribe({
          next: (data) => {
            this.medicamentos.set(data ?? []);
            this.agregandoMedicamento=false;
 
            // Detectar el nuevo y pre-seleccionarlo en el select
            const nuevo = data.find((m) => !idsAntes.includes(m.id_medicamento));
            if (nuevo) {
              this.idMedicamentoSeleccionado.set(0);
              setTimeout(() => {
                this.idMedicamentoSeleccionado.set(nuevo.id_medicamento);
                this.nuevoTratamiento.id_medicamento = nuevo.id_medicamento;
                this.nuevoTratamiento.nombre_medicamento = nuevo.nombre;
              });
            }
            this.cdr.detectChanges();
          },
          error: () => {
            this.agregandoMedicamento=false;
            this.cdr.detectChanges();
          },
        });
      },
      error: (err) => {
        this.agregandoMedicamento=false;
        this.errorModal.mostrar(err?.error?.mensaje || "Error al agregar medicamento");
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
    if (!this.form.motivo_consulta.trim()) {
      this.errorModal.mostrar("El motivo es obligatorio");
      return;
    }
    if (!this.form.diagnostico.trim()) {
      this.errorModal.mostrar("El diagnostico es obligatorio");
      return;
    }
    if (!this.form.tratamiento.trim()) {
      this.errorModal.mostrar("El tratemiento es obligatorio");
      return;
    }
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
