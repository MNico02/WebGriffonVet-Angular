import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorModalService {

  visible = signal(false);
  mensaje = signal('');

  mostrar(mensaje: string) {
    this.mensaje.set(mensaje);
    this.visible.set(true);
  }

  cerrar() {
    this.visible.set(false);
    this.mensaje.set('');
  }
}