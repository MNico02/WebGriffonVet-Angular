import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioMismascotasService } from '../../../core/services/usuario-mismascotas';
import { MascotaUsuario } from '../../../api/models/mascota-usuario.model';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-mascotas',
  standalone: true,
  templateUrl: './mascotas.html',
  styleUrl: './mascotas.css',
  imports: [CommonModule]
})
export class Mascotas implements OnInit {

  mascotas: MascotaUsuario[] = [];
  loading = true;

  constructor(
  private service: UsuarioMismascotasService,
  private cdr: ChangeDetectorRef
) {}

  ngOnInit(): void {
    const id_usuario = 2;

    this.service.obtenerMascotas(id_usuario).subscribe({
  next: (data) => {

    this.mascotas = data.map(m => ({
      ...m,
      especie: this.normalizar(m.especie),
      edad: this.calcularEdad(m.fecha_nacimiento)
    }));

    console.log('SET MASCOTAS:', this.mascotas);

    this.loading = false;

    // 💣 ESTO ES LA CLAVE
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

    if (meses < 0) {
      años--;
      meses += 12;
    }

    if (años > 0) return `${años} año${años > 1 ? 's' : ''}`;
    return `${meses} mes${meses > 1 ? 'es' : ''}`;
  }
  trackById(index: number, item: MascotaUsuario) {
  return item.id_mascota;
}
}