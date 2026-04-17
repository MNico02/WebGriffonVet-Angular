import { Component, input, output, signal, model , effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {  ItemSeleccionable } from '../../../api/models/itemSeleccionable'


@Component({
  selector: 'app-select-con-creacion',
  imports: [CommonModule, FormsModule],
  templateUrl: './select-con-creacion.html',
  styleUrl: './select-con-creacion.css',
})
export class SelectConCreacion {
  items             = input.required<ItemSeleccionable[]>();
  cargando          = input<boolean>(false);
  guardando         = input<boolean>(false);
  label             = input<string>('¿No encontrás el elemento?');
  placeholder       = input<string>('Seleccionar...');
  inputPlaceholder  = input<string>('Nombre del nuevo elemento...');

  valorSeleccionado = model<number>(0);

  seleccionado = output<ItemSeleccionable>();
  nuevoItem    = output<string>();

  mostrarInput = signal(false);
  nuevoNombre  = '';

  onSeleccionar(id: number) {
    const item = this.items().find(i => i.id === +id);
    if (item) {
      this.valorSeleccionado.set(item.id);
      this.seleccionado.emit(item);
    }
  }

  confirmarNuevo() {
    if (!this.nuevoNombre.trim()) return;
    this.nuevoItem.emit(this.nuevoNombre.trim().toUpperCase());
    this.nuevoNombre = '';
    this.mostrarInput.set(false);
  }
}