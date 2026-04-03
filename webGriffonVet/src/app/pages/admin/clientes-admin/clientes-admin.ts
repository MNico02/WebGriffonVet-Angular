import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Cliente } from '../../../api/models/cliente';
import { ClienteService } from '../../../core/services/cliente-service';
import { ChangeDetectorRef } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { HistorialClinicoAdmin } from '../historial-clinico-admin/historial-clinico-admin';

@Component({
  selector: 'app-clientes-admin',
  imports: [CommonModule, HistorialClinicoAdmin],
  templateUrl: './clientes-admin.html',
  styleUrl: './clientes-admin.css',
})
export class ClientesAdmin  {

  clientes: Cliente[] = [];

  constructor(
    private service: ClienteService,
    private router: Router,
    
  ) {}

  clientesResource = rxResource({
    stream: () => this.service.getClientes()
  });

  mascotaSeleccionadaId = signal<number | null>(null);
  usuarioSeleccionadoId = signal<number | null>(null);

  seleccionarMascota(idMascota: number, idUsuario: number) {
    if (this.mascotaSeleccionadaId() === idMascota) {
      this.mascotaSeleccionadaId.set(null);
      this.usuarioSeleccionadoId.set(null);
    } else {
      this.mascotaSeleccionadaId.set(idMascota);
      this.usuarioSeleccionadoId.set(idUsuario);
    }
  }




}
