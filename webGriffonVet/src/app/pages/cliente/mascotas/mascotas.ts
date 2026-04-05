import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MascotaService } from '../../../core/services/mascota-service';
import { MascotaUsuario } from '../../../api/models/mascota-usuario.model';
import { ChangeDetectorRef } from '@angular/core';
import { EditarMascota } from '../../../layouts/editar-mascota/editar-mascota';
import { editarMascotaRequest } from '../../../api/models/historialClinico';

@Component({
  selector: 'app-mascotas',
  standalone: true,
  templateUrl: './mascotas.html',
  styleUrl: './mascotas.css',
  imports: [CommonModule, EditarMascota]
})
export class Mascotas implements OnInit {

  mascotas: MascotaUsuario[] = [];
  loading = true;

  modalEditarAbierto = signal(false);
  mascotaSeleccionada = signal<editarMascotaRequest | null>(null);

  constructor(
    private service: MascotaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
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

  abrirEditar(m: MascotaUsuario) {
    this.mascotaSeleccionada.set({
      id_usuario: 0,
      id_mascota: m.id_mascota,
      nombre: m.nombre ?? '',
      especie: m.especie ?? '',
      raza: m.raza ?? '',
      tamanio: '',
      sexo: m.sexo ?? '',
      tipo_pelaje:'',
      comportamiento:'',
      observaciones: '',
      fecha_nacimiento: m.fecha_nacimiento ? m.fecha_nacimiento.substring(0, 10) : ''
    });
    this.modalEditarAbierto.set(true);
  }

  onMascotaEditada() {
    this.modalEditarAbierto.set(false);
    // Recargá la lista
    this.service.getMascotas().subscribe({
      next: (data) => {
        this.mascotas = data.map(m => ({
          ...m,
          especie: this.normalizar(m.especie),
          edad: this.calcularEdad(m.fecha_nacimiento)
        }));
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
}