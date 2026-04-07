import { Component, inject, signal, input, ViewChild, ElementRef, AfterViewInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { MascotaService } from '../../../core/services/mascota-service';
import { EMPTY } from 'rxjs';
import { NuevaConsulta } from '../../../layouts/admin/nueva-consulta/nueva-consulta';
import { NuevaVacunacion } from '../../../layouts/admin/nuevavacunacion/nuevavacunacion';
import { NuevaDesparasitacion } from '../../../layouts/admin/nueva-desparasitacion/nueva-desparasitacion';
import { NuevoPeso } from '../../../layouts/admin/nuevo-peso/nuevo-peso';
import { NuevaEnfermedad } from '../../../layouts/admin/nueva-enfemedad/nueva-enfemedad';
import { NuevaAlergia } from '../../../layouts/admin/nueva-alergia/nueva-alergia';
import { EditarMascota } from '../../../layouts/editar-mascota/editar-mascota';
import { editarMascotaRequest } from '../../../api/models/historialClinico';

@Component({
  selector: 'app-historial-clinico-admin',
  imports: [CommonModule, NuevaConsulta, NuevaVacunacion, NuevaDesparasitacion, NuevoPeso, NuevaEnfermedad, NuevaAlergia, EditarMascota],
  templateUrl: './historial-clinico-admin.html',
  styleUrl: './historial-clinico-admin.css',
})
export class HistorialClinicoAdmin implements AfterViewInit {  
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
  modalVacunacionAbierto = signal(false);
  modalDesparasitacionAbierto = signal(false);
  modalPesoAbierto = signal(false);
  modalEnfermedadAbierto = signal(false);
  modalAlergiaAbierto = signal(false);
  modalEditarAbierto = signal(false);

  @ViewChild('tabsContainer') tabsContainer!: ElementRef<HTMLDivElement>;

  thumbWidth = 100;
  thumbLeft = 0;

  tabs = [
    { id: 'info',           label: 'Info General',   icono: '📋' },
    { id: 'consultas',      label: 'Consultas',       icono: '🧾', count: true },
    { id: 'vacunas',        label: 'Vacunación',      icono: '💉', count: true },
    { id: 'desparasitacion',label: 'Desparasitación', icono: '', count: true },
    { id: 'peso',           label: 'Peso',            icono: '⚖️' },
    { id: 'enfermedades',   label: 'Enfermedades',    icono: '🦠', count: true },
    { id: 'alergias',       label: 'Alergias',        icono: '⚠️', count: true },
    { id: 'tratamientos',   label: 'Tratamientos',    icono: '💊', count: true },
    { id: 'estudios',       label: 'Estudios',        icono: '🧪', count: true },
  ];

  ngAfterViewInit() {
    setTimeout(() => this.updateThumb(), 150);
  }

  onTabsScroll() {
    this.updateThumb();
  }

  updateThumb() {
    const el = this.tabsContainer?.nativeElement;
    if (!el) return;
    const scrollable = el.scrollWidth - el.clientWidth;
    if (scrollable <= 0) {
      this.thumbWidth = 100;
      this.thumbLeft = 0;
      return;
    }
    this.thumbWidth = (el.clientWidth / el.scrollWidth) * 100;
    this.thumbLeft = (el.scrollLeft / el.scrollWidth) * 100;
  }

  switchTab(tab: string) {
    this.tabActiva.set(tab);
    // scroll el tab activo a la vista
    setTimeout(() => {
      const el = this.tabsContainer?.nativeElement;
      const activeBtn = el?.querySelector(`[data-tab="${tab}"]`) as HTMLElement;
      activeBtn?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }, 50);
  }

  getCount(tabId: string): number {
    const paciente = this.mascotaResource.value();
    if (!paciente) return 0;
    const map: Record<string, any[]> = {
      consultas:        paciente.historia_clinica?.consultas ?? [],
      vacunas:          paciente.vacunas ?? [],
      desparasitacion:  paciente.desparasitaciones ?? [],
      enfermedades:     paciente.enfermedades ?? [],
      alergias:         paciente.alergias ?? [],
      tratamientos:     paciente.historia_clinica?.consultas?.flatMap(c => c.tratamientos ?? []) ?? [],
      estudios:         paciente.historia_clinica?.consultas?.flatMap(c => c.estudios ?? []) ?? [],
    };
    return map[tabId]?.length ?? 0;
  }

  calcularEdad(fechaNacimiento: string): string {
  if (!fechaNacimiento) return 'Sin fecha';

  const [anio, mes, dia] = fechaNacimiento.split('-').map(Number);
  const nacimiento = new Date(anio, mes - 1, dia);

  if (isNaN(nacimiento.getTime())) return 'Fecha inválida';

  const hoy = new Date();
  let anios = hoy.getFullYear() - nacimiento.getFullYear();
  let meses = hoy.getMonth() - nacimiento.getMonth();

  if (meses < 0) { anios--; meses += 12; }

  if (anios === 0 && meses === 0) return 'Menos de 1 mes';  // ← caso faltante
  if (anios === 0) return `${meses} ${meses === 1 ? 'mes' : 'meses'}`;
  if (meses === 0) return `${anios} ${anios === 1 ? 'año' : 'años'}`;
  return `${anios} ${anios === 1 ? 'año' : 'años'} y ${meses} ${meses === 1 ? 'mes' : 'meses'}`;
}

  get todosLosTratamientos() {
    return this.mascotaResource.value()?.historia_clinica?.consultas?.flatMap(c =>
      (c.tratamientos ?? []).map(t => ({ ...t, fecha_consulta: c.fecha, motivo_consulta: c.motivo_consulta }))
    ) ?? [];
  }

  get todosLosEstudios() {
    return this.mascotaResource.value()?.historia_clinica?.consultas?.flatMap(c =>
      (c.estudios ?? []).map(e => ({ ...e, fecha_consulta: c.fecha, motivo_consulta: c.motivo_consulta }))
    ) ?? [];
  }
    mascotaParaEditar = computed<editarMascotaRequest | null>(() => {
    const m = this.mascotaResource.value();
    if (!m) return null;
    return {
      id_usuario: this.usuarioId(),
      id_mascota: this.mascotaId(),
      nombre: m.nombre ?? '',
      especie: m.especie ?? '',
      raza: m.raza ?? '',
      tamanio: m.tamanio ?? '',
      sexo: m.sexo ?? '',
      tipo_pelaje: m.tipo_pelaje ?? '',
      comportamiento: m.comportamiento ?? '',
      observaciones: m.observaciones ?? '',
      fecha_nacimiento: m.fecha_nacimiento ? m.fecha_nacimiento.substring(0, 10) : '',
      castrado: m.castrado ?? false,
    };
  });
  esImagen(url: string): boolean {
  return /\.(jpg|jpeg|png|webp)$/i.test(url);
}
}