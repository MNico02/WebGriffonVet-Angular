import { Component, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-historial-clinico-admin',
  imports: [CommonModule],
  templateUrl: './historial-clinico-admin.html',
  styleUrl: './historial-clinico-admin.css',
})
export class HistorialClinicoAdmin implements OnInit {
  
  paciente: any = null;
  
  tabActiva = 'info';

  tabs = [
    { id: 'info',           label: 'Info General',    icono: '📋' },
    { id: 'consultas',      label: 'Consultas',        icono: '🧾', count: true },
    { id: 'vacunas',        label: 'Vacunación',       icono: '💉', count: true },
    { id: 'desparasitacion',label: 'Desparasitación',  icono: '🪱', count: true },
    { id: 'peso',           label: 'Peso',             icono: '⚖️' },
    { id: 'enfermedades',   label: 'Enfermedades',     icono: '🦠', count: true },
    { id: 'alergias',       label: 'Alergias',         icono: '⚠️', count: true },
    { id: 'tratamientos',   label: 'Tratamientos',     icono: '💊', count: true },
    { id: 'estudios',       label: 'Estudios',         icono: '🧪', count: true },
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const mascotaId = this.route.snapshot.paramMap.get('id');
    this.paciente = {
    nombre: 'Firulais',
    especie: 'Perro',
    raza: 'Labrador',
    edad: 4,
    sexo: 'Macho',
    duenio: 'Juan Pérez',
    observaciones: 'Paciente tranquilo, muy colaborador en las consultas.',

    consultas: [
      { fecha: '2024-03-10', motivo: 'Control anual', diagnostico: 'Todo en orden', tratamiento: 'Ninguno' },
      { fecha: '2024-01-05', motivo: 'Vómitos frecuentes', diagnostico: 'Gastritis leve', tratamiento: 'Omeprazol 10mg por 5 días' },
    ],

    vacunas: [
      { nombre: 'Séxtuple', fechaAplicacion: '2024-02-01', proximaDosis: '2025-02-01', estado: 'Al día', observaciones: '' },
      { nombre: 'Antirrábica', fechaAplicacion: '2023-08-15', proximaDosis: '2024-08-15', estado: 'Vencida', observaciones: 'Reprogramar urgente' },
      { nombre: 'Bordetella', fechaAplicacion: '2024-03-01', proximaDosis: '2024-09-01', estado: 'Próxima', observaciones: '' },
    ],

    desparasitacion: [
      { tipo: 'Interna', producto: 'Milbemax', fecha: '2024-02-15', proximaDosis: '2024-05-15', observaciones: '' },
      { tipo: 'Externa', producto: 'Frontline Spray', fecha: '2024-03-01', proximaDosis: '2024-04-01', observaciones: 'Zona rural, mayor exposición' },
    ],

    peso: [
      { fecha: '2024-03-10', valor: 28.5, condicion: 'Ideal', notas: '' },
      { fecha: '2024-01-05', valor: 30.1, condicion: 'Sobrepeso leve', notas: 'Reducir raciones' },
      { fecha: '2023-10-20', valor: 27.8, condicion: 'Ideal', notas: '' },
    ],

    enfermedades: [
      { nombre: 'Gastritis', estado: 'Superada', diagnostico: '2024-01-05', observaciones: 'Resolvió con tratamiento' },
      { nombre: 'Displasia de cadera', estado: 'Crónica', diagnostico: '2022-06-10', observaciones: 'Control cada 6 meses' },
    ],

    alergias: [
      { alergeno: 'Pollo', severidad: 'Moderada', reaccion: 'Dermatitis', notas: 'Evitar alimentos con pollo' },
      { alergeno: 'Pasto kikuyo', severidad: 'Leve', reaccion: 'Estornudos', notas: '' },
    ],

    tratamientos: [
      { medicamento: 'Meloxicam', dosis: '0.1mg/kg cada 24hs', duracion: '10 días', estado: 'Finalizado', indicaciones: 'Con comida' },
      { medicamento: 'Condroitín', dosis: '1 comprimido cada 24hs', duracion: 'Indefinido', estado: 'Activo', indicaciones: 'Para displasia' },
    ],

    estudios: [
      { tipo: 'Radiografía', fecha: '2022-06-10', resultado: 'Displasia bilateral leve', observaciones: 'Control anual recomendado' },
      { tipo: 'Hemograma', fecha: '2024-03-10', resultado: 'Dentro de valores normales', observaciones: '' },
    ],
  };
  }

  cargarPaciente(id: string) {
    // reemplazá esto con tu llamada real al servicio
    // this.veterinariaService.getMascota(id).subscribe(data => this.paciente = data);
  }

  switchTab(tab: string) {
    this.tabActiva = tab;
  }

  getCount(tabId: string): number {
    if (!this.paciente) return 0;
    const map: Record<string, any[]> = {
      consultas:       this.paciente.consultas,
      vacunas:         this.paciente.vacunas,
      desparasitacion: this.paciente.desparasitacion,
      enfermedades:    this.paciente.enfermedades,
      alergias:        this.paciente.alergias,
      tratamientos:    this.paciente.tratamientos,
      estudios:        this.paciente.estudios,
    };
    return map[tabId]?.length ?? 0;
  }
}