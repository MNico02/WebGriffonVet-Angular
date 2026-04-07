import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../../core/services/cliente-service';

@Component({
  selector: 'app-nuevo-cliente-desde-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nuevo-cliente-desde-admin.html',
  styleUrl: './nuevo-cliente-desde-admin.css'
})
export class NuevoClienteDesdeAdmin {

  @Output() cerrar = new EventEmitter<void>();
  @Output() clienteGuardado = new EventEmitter<void>();

  constructor(private service: ClienteService) {}

  formCliente = {
    cliente: {
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      password: ''
    },
    mascota: {
      nombre: '',
      especie: '',
      raza: '',
      tamanio: '',
      fecha_nacimiento: '',
      sexo: '',
      tipo_pelaje: '',
      observaciones: '',
      castrado: false 
    }
  };

  guardar() {
    this.service.insertarCliente(this.formCliente).subscribe({
      next: () => {
        this.clienteGuardado.emit();
        this.cerrar.emit();
      },
      error: (err) => console.error(err)
    });
  }
}