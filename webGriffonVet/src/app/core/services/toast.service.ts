import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  visible = signal(false);
  mensaje = signal('');
  tipo = signal<'success' | 'error'>('success');

  mostrar(mensaje: string, tipo: 'success' | 'error' = 'success') {
    this.mensaje.set(mensaje);
    this.tipo.set(tipo);
    this.visible.set(true);

    setTimeout(() => {
      this.visible.set(false);
    }, 3000);
  }
}