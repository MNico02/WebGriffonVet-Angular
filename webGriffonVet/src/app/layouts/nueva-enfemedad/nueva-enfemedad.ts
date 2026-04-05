import { Component, input, output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HistorialClinicoService } from '../../core/services/historial-clinico-service';
import { enfermedad, enfermedadMascotaRequest } from '../../api/models/historialClinico';

@Component({
  selector: 'app-nueva-enfermedad',
  imports: [CommonModule, FormsModule],
  templateUrl: './nueva-enfemedad.html',
  styleUrl: './nueva-enfemedad.css'
})
export class NuevaEnfermedad implements OnInit {

  mascotaId = input.required<number>();
  usuarioId = input.required<number>();
  private enfermedadService = inject(HistorialClinicoService);

  cerrar = output<void>();
  enfermedadGuardada = output<void>();

  enfermedades: enfermedad[] = [];
  cargandoEnfermedades = false;

  nuevaEnfermedadNombre = '';
  agregandoEnfermedad = false;

  estados = ['ACTIVA', 'CURADA', 'CRONICA'];

  form: enfermedadMascotaRequest = {
    id_mascota: 0,
    id_usuario: 0,
    id_enfermedad: 0,
    estado: '',
    fecha_diagnostico: '',
    observaciones: ''
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
      },
      error: () => {
        this.cargandoEnfermedades = false;
        this.agregandoEnfermedad = false;
      }
    });
  }

  insertarEnfermedad() {
    if (!this.nuevaEnfermedadNombre.trim()) return;
    this.agregandoEnfermedad = true;
    this.enfermedadService.insertarEnfermedadCatalogo(this.nuevaEnfermedadNombre.trim()).subscribe({
      next: () => {
        this.nuevaEnfermedadNombre = '';
        this.cargarEnfermedades();
      },
      error: () => {
        this.agregandoEnfermedad = false;
      }
    });
  }

  guardar() {
    const payload: enfermedadMascotaRequest = {
      ...this.form,
      id_usuario: this.usuarioId(),
      id_mascota: this.mascotaId()
    };

    console.log('Payload enfermedad:', payload);

    this.enfermedadService.insertarEnfermedad(payload).subscribe(() => {
      this.enfermedadGuardada.emit();
      this.cerrar.emit();
    });
  }

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.cerrar.emit();
    }
  }
}