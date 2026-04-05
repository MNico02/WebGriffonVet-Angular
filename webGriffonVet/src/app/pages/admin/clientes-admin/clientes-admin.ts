import { Component, signal, computed} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Cliente } from '../../../api/models/cliente';
import { ClienteService } from '../../../core/services/cliente-service';
import { ChangeDetectorRef } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { HistorialClinicoAdmin } from '../historial-clinico-admin/historial-clinico-admin';
import { FormsModule } from '@angular/forms';
import { NuevoClienteDesdeAdmin } from '../../../layouts/admin/nuevo-cliente-desde-admin/nuevo-cliente-desde-admin';

@Component({
  selector: 'app-clientes-admin',
  imports: [CommonModule, HistorialClinicoAdmin, NuevoClienteDesdeAdmin],
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
  searchQuery = signal('');

  seleccionarMascota(idMascota: number, idUsuario: number) {
    if (this.mascotaSeleccionadaId() === idMascota) {
      this.mascotaSeleccionadaId.set(null);
      this.usuarioSeleccionadoId.set(null);
    } else {
      this.mascotaSeleccionadaId.set(idMascota);
      this.usuarioSeleccionadoId.set(idUsuario);
    }
  }

  clientesFiltrados = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const clientes = this.clientesResource.value() ?? [];

    if (!query) return clientes;

    return clientes.filter(cliente =>
      cliente.nombre_completo.toLowerCase().includes(query) ||
      cliente.email.toLowerCase().includes(query) ||
      cliente.mascotas.some(m => m.nombre_mascota.toLowerCase().includes(query))
    );
  });

  mostrarModal = signal(false);

abrirModal() {
  this.mostrarModal.set(true);
}
   cerrarModal() {
  this.mostrarModal.set(false);
}



getIconoMascota(mascota: any): string {
  const especie = mascota.especie?.toUpperCase();

  if (especie === 'PERRO') return 'pets'; // podés cambiar
  if (especie === 'GATO') return 'pets'; // icono tipo gato

  return 'pets'; // fallback
}

getColorMascota(mascota: any): string {
  const sexo = mascota.sexo?.toUpperCase();

  if (sexo === 'MACHO') return 'text-blue-500';
  if (sexo === 'HEMBRA') return 'text-pink-500';

  return 'text-gray-400';
}

}



