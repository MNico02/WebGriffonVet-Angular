import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { rxResource } from '@angular/core/rxjs-interop';
import { ServicioService } from '../../../core/services/servicio-service';
import { MascotaService } from '../../../core/services/mascota-service';
import { MascotaUsuario } from '../../../api/models/mascota-usuario.model';
import { servicio } from '../../../api/models/servicio';

@Component({
  selector: 'app-turnos',
  imports: [CommonModule, FormsModule],
  templateUrl: './turnos.html',
  styleUrl: './turnos.css',
})
export class Turnos {

  private readonly WHATSAPP_NUMBER = '5493571666795'; 

  constructor(private servicioService: ServicioService,
  private mascotaService: MascotaService) {}

  serviciosResource = rxResource({
    stream: () => this.servicioService.getServicios(),
  });

  // 🧠 NUEVO FORM
 mascota = signal<MascotaUsuario | null>(null);
servicio = signal<servicio | null>(null);
  fecha = signal('');
  hora = signal('');
  nota = signal('');

mascotasResource = rxResource({
  stream: () => this.mascotaService.getMascotas(),
});
  whatsappUrl = computed(() => {
    if (!this.mascota() || !this.servicio() || !this.fecha()) return '';

    const fechaFormateada = new Date(this.fecha()).toLocaleDateString('es-AR');

    const texto = `
Hola! Quisiera solicitar un turno para:

Mascota: ${this.mascota()?.nombre}
Servicio: ${this.servicio()?.nombre}
Día: ${fechaFormateada}
Hora: ${this.hora() || 'A coordinar'}

Detalle: ${this.nota() || '-'}
`.trim();

    return `https://wa.me/${this.WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;
  });
}