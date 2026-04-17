import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmar-eliminar-modal',
  imports: [CommonModule],
  templateUrl: './confirmar-eliminar-modal.html',
  styleUrl: './confirmar-eliminar-modal.css',
})
export class ConfirmarEliminarModal {  mensaje = input<string>('¿Seguro que querés eliminar este elemento?');
  visible = input.required<boolean>();

  confirmado = output<void>();
  cancelado = output<void>();
}
