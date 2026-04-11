import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { MascotaService } from '../../../core/services/mascota-service';
import { MascotaUsuario } from '../../../api/models/mascota-usuario.model';
import { ChangeDetectorRef } from '@angular/core';
import { EditarMascota } from '../../../layouts/editar-mascota/editar-mascota';
import { editarMascotaRequest } from '../../../api/models/historialClinico';
import { AuthService } from '../../../core/services/auth';
import { NuevaMascota } from '../../../layouts/cliente/nueva-mascota/nueva-mascota';
import { HistorialClinicoAdmin } from '../../admin/historial-clinico-admin/historial-clinico-admin';

@Component({
  selector: 'app-mascotas',
  standalone: true,
  templateUrl: './mascotas.html',
  styleUrl: './mascotas.css',
  imports: [CommonModule, EditarMascota, NuevaMascota, HistorialClinicoAdmin]
})
export class Mascotas implements OnInit {

  mascotas: MascotaUsuario[] = [];
  loading = true;

  // ID de la mascota cuyo panel está abierto; null = ninguno
  mascotaExpandida: number | null = null;

  modalEditarAbierto = signal(false);
  mascotaSeleccionada = signal<editarMascotaRequest | null>(null);
  modalAgregarAbierto = signal(false);
  mascotaSeleccionadaId = signal<number | null>(null);
  usuarioSeleccionadoId = signal<number | null>(null);



  constructor(
    private service: MascotaService,
    private auth: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarMascotas();
  }

  toggleDetalles(id: number): void {
    this.mascotaExpandida = this.mascotaExpandida === id ? null : id;
  }

  abrirEditar(m: MascotaUsuario) {
    this.mascotaSeleccionada.set({
      id_usuario: this.auth.getIdUsuario(),
      id_mascota: m.id_mascota,
      nombre: m.nombre ?? '',
      id_especie: m.id_especie ?? null,
      especie: m.especie ?? '',
      raza: m.raza ?? '',
      tamanio: m.tamanio ?? '',
      sexo: m.sexo ?? '',
      tipo_pelaje: m.tipo_pelaje ?? '',
      comportamiento: m.comportamiento ?? '',
      observaciones: m.observaciones ?? '',
      fecha_nacimiento: m.fecha_nacimiento ? m.fecha_nacimiento.substring(0, 10) : '',
      castrado: m.castrado ?? false,
    });
    this.modalEditarAbierto.set(true);
  }

  onMascotaEditada() {
    this.modalEditarAbierto.set(false);
    this.cargarMascotas();
  }

  abrirAgregar() {
    this.modalAgregarAbierto.set(true);
  }

  onMascotaAgregada() {
    this.modalAgregarAbierto.set(false);
    this.cargarMascotas();
  }
    abrirHistorial(m: MascotaUsuario) {
    // Si clickeás la misma, la cierra (toggle)
    if (this.mascotaSeleccionadaId() === m.id_mascota) {
      this.mascotaSeleccionadaId.set(null);
      this.usuarioSeleccionadoId.set(null);
    } else {
      this.mascotaSeleccionadaId.set(m.id_mascota);
      this.usuarioSeleccionadoId.set(this.auth.getIdUsuario());
    }
  }

  private cargarMascotas(): void {
    this.service.getMascotas().subscribe({
      next: (data) => {
        this.mascotas = data.map(m => ({
          ...m,
          especie: this.normalizar(m.especie),
          edad: this.calcularEdad(m.fecha_nacimiento)
        }));
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  normalizar(valor: any): string {
    return (valor ?? '').toString().trim().toUpperCase();
  }

  calcularEdad(fecha: string): string {
    if (!fecha) return '';
    const nacimiento = new Date(fecha);
    const hoy = new Date();
    let años = hoy.getFullYear() - nacimiento.getFullYear();
    let meses = hoy.getMonth() - nacimiento.getMonth();
    if (meses < 0) { años--; meses += 12; }
    if (años > 0) return `${años} año${años > 1 ? 's' : ''}`;
    return `${meses} mes${meses > 1 ? 'es' : ''}`;
  }

  trackById(index: number, item: MascotaUsuario) {
    return item.id_mascota;
  }
  getIdUsuario(){
    return this.auth.getIdUsuario();
  }
}