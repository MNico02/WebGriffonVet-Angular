import { Component, input, output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NuevoTratamientoRequest, NuevaConsultaRequest } from '../../../api/models/historialClinico';
import { HistorialClinicoService } from '../../../core/services/historial-clinico-service';
import { Medicamento } from '../../../api/models/historialClinico';

export interface NuevoEstudioRequest {
  tipo_estudio: string;
  resultado: string;
  observaciones: string;
}

@Component({
  selector: 'app-nueva-consulta-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './nueva-consulta.html',
  styleUrl: './nueva-consulta.css'
})
export class NuevaConsulta implements OnInit {
  mascotaId = input.required<number>();
  usuarioId = input.required<number>();
  private service = inject(HistorialClinicoService);

  cerrar = output<void>();
  consultaGuardada = output<void>();

  // Lista de medicamentos disponibles
  medicamentos: Medicamento[] = [];
  cargandoMedicamentos = false;

  // Para agregar un medicamento nuevo al sistema
  nuevoMedicamentoNombre = '';
  agregandoMedicamento = false;

  form: NuevaConsultaRequest = {
    id_usuario: 0,
    id_mascota: 0,
    motivo_consulta: '',
    anamnesis: '',
    examen_general: '',
    diagnostico_presuntivo: '',
    diagnostico: '',
    tratamiento: '',
    observaciones: '',
    tratamientos: [],
    estudios: [],
    archivos: []
  };

  nuevoTratamiento: NuevoTratamientoRequest = {
    id_medicamento: 0,
    nombre_medicamento: '',
    dosis: '',
    frecuencia: '',
    duracion_dias: 0,
    indicaciones: ''
  };

  nuevoEstudio: NuevoEstudioRequest = {
    tipo_estudio: '',
    resultado: '',
    observaciones: ''
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
      },
      error: () => {
        this.cargandoMedicamentos = false;
        this.agregandoMedicamento = false;
      }
    });
  }

  onMedicamentoSeleccionado() {
    const med = this.medicamentos.find(m => m.id_medicamento === +this.nuevoTratamiento.id_medicamento);
    if (med) {
      this.nuevoTratamiento.nombre_medicamento = med.nombre;
    }
  }

    insertarMedicamento() {
    if (!this.nuevoMedicamentoNombre.trim()) return;
    this.agregandoMedicamento = true;
    this.service.insertarMedicamento(this.nuevoMedicamentoNombre.trim()).subscribe({
      next: () => {
        this.nuevoMedicamentoNombre = '';
        this.cargarMedicamentos();
      },
      error: () => {
        this.agregandoMedicamento = false;
      }
    });
  }

  agregarTratamiento() {
    if (!this.nuevoTratamiento.id_medicamento) return;
    this.form.tratamientos.push({ ...this.nuevoTratamiento });
    this.nuevoTratamiento = {
      id_medicamento: 0,
      nombre_medicamento: '',
      dosis: '',
      frecuencia: '',
      duracion_dias: 0,
      indicaciones: ''
    };
  }

  eliminarTratamiento(index: number) {
    this.form.tratamientos.splice(index, 1);
  }

  agregarEstudio() {
    if (!this.nuevoEstudio.tipo_estudio.trim()) return;
    this.form.estudios.push({ ...this.nuevoEstudio });
    this.nuevoEstudio = {
      tipo_estudio: '',
      resultado: '',
      observaciones: ''
    };
  }

  eliminarEstudio(index: number) {
    this.form.estudios.splice(index, 1);
  }

  guardar() {
    const payload: NuevaConsultaRequest = {
      ...this.form,
      id_usuario: this.usuarioId(),
      id_mascota: this.mascotaId()
    };

    console.log('Payload a enviar:', payload);

    this.service.crearConsulta(payload).subscribe(() => {
      this.consultaGuardada.emit();
      this.cerrar.emit();
    });
  }

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.cerrar.emit();
    }
  }
  autoResize(event: Event) {
  const textarea = event.target as HTMLTextAreaElement;

  textarea.style.height = 'auto'; // reset
  textarea.style.height = textarea.scrollHeight + 'px'; // crecer
}
}