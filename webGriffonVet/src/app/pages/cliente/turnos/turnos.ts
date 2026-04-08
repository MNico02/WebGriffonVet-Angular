import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { ServicioService } from '../../../core/services/servicio-service';

@Component({
  selector: 'app-turnos',
  imports: [],
  templateUrl: './turnos.html',
  styleUrl: './turnos.css',
})
export class Turnos {

  private readonly WHATSAPP_NUMBER = 'xxxxxxxxxx'; 

  constructor(private servicioService: ServicioService) {}

  serviciosResource = rxResource({
    stream: () => this.servicioService.getServicios(),
  });

  whatsappUrl = computed(() => {
    const mensaje = encodeURIComponent('Hola! Me gustaría consultar sobre los servicios disponibles.');
    return `https://wa.me/${this.WHATSAPP_NUMBER}?text=${mensaje}`;
  });
}
