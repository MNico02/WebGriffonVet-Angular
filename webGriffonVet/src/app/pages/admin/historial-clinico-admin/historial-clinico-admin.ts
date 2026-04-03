import { Component, inject, signal, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { MascotaService } from '../../../core/services/mascota-service';
import { EMPTY } from 'rxjs';
import { NuevaConsulta } from '../../../layouts/nueva-consulta/nueva-consulta';

@Component({
  selector: 'app-historial-clinico-admin',
  imports: [CommonModule, NuevaConsulta],
  templateUrl: './historial-clinico-admin.html',
  styleUrl: './historial-clinico-admin.css',
})
export class HistorialClinicoAdmin {
  private route = inject(ActivatedRoute);
  private mascotaService = inject(MascotaService);

  mascotaId = input.required<number>();
  usuarioId = input.required<number>();

  mascotaResource = rxResource({
    params: () => ({ mascotaId: this.mascotaId(), usuarioId: this.usuarioId() }),
    stream: ({ params }) => {
      if (!params.mascotaId || !params.usuarioId) return EMPTY;
      return this.mascotaService.getMascota(params.mascotaId, params.usuarioId);
    },
  });

  tabActiva = signal('info');
  modalAbierto = signal(false);

  tabs = [
    { id: 'info', label: 'Info General', icono: '📋' },
    { id: 'consultas', label: 'Consultas', icono: '🧾', count: true },
    { id: 'vacunas', label: 'Vacunación', icono: '💉', count: true },
    { id: 'desparasitacion', label: 'Desparasitación', icono: '🪱', count: true },
    { id: 'peso', label: 'Peso', icono: '⚖️' },
    { id: 'enfermedades', label: 'Enfermedades', icono: '🦠', count: true },
    { id: 'alergias', label: 'Alergias', icono: '⚠️', count: true },
    { id: 'tratamientos', label: 'Tratamientos', icono: '💊', count: true },
    { id: 'estudios', label: 'Estudios', icono: '🧪', count: true },
  ];

  switchTab(tab: string) {
    this.tabActiva.set(tab);
  }

  getCount(tabId: string): number {
    const paciente = this.mascotaResource.value();
    if (!paciente) return 0;
    const map: Record<string, any[]> = {
      consultas:       paciente.historia_clinica?.consultas ?? [],
      vacunas:         paciente.vacunas ?? [],
      desparasitacion: paciente.desparasitaciones ?? [],
      enfermedades:    paciente.enfermedades ?? [],
      alergias:        paciente.alergias ?? [],
      tratamientos:    paciente.historia_clinica?.consultas?.flatMap(c => c.tratamientos ?? []) ?? [],
      estudios:        paciente.historia_clinica?.consultas?.flatMap(c => c.estudios ?? []) ?? [],
    };
    return map[tabId]?.length ?? 0;
  }

  calcularEdad(fechaNacimiento: number): string {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);

    let anios = hoy.getFullYear() - nacimiento.getFullYear();
    let meses = hoy.getMonth() - nacimiento.getMonth();

    if (meses < 0) {
      anios--;
      meses += 12;
    }

    if (anios === 0) {
      return `${meses} ${meses === 1 ? 'mes' : 'meses'}`;
    }

    if (meses === 0) {
      return `${anios} ${anios === 1 ? 'año' : 'años'}`;
    }

    return `${anios} ${anios === 1 ? 'año' : 'años'} y ${meses} ${meses === 1 ? 'mes' : 'meses'}`;
  }

    get todosLosTratamientos() {
      return this.mascotaResource.value()?.historia_clinica?.consultas?.flatMap(c =>
        (c.tratamientos ?? []).map(t => ({
          ...t,
          fecha_consulta: c.fecha,
          motivo_consulta: c.motivo_consulta,
        }))
      ) ?? [];
    }

    get todosLosEstudios() {
      return this.mascotaResource.value()?.historia_clinica?.consultas?.flatMap(c =>
        (c.estudios ?? []).map(e => ({
          ...e,
          fecha_consulta: c.fecha,
          motivo_consulta: c.motivo_consulta,
        }))
      ) ?? [];
    }
}
