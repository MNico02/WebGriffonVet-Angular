import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorModalService } from '../../core/services/error-modal';

@Component({
  selector: 'app-error-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (error.visible()) {
      <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

        <div class="bg-white rounded-xl shadow-xl p-6 w-[350px]">

          <p class="text-center text-sm font-bold text-red-600 mb-4">
            ⚠ Error
          </p>

          <p class="text-center text-sm text-gray-700 mb-6">
            {{ error.mensaje() }}
          </p>

          <div class="flex justify-center">
            <button
              (click)="error.cerrar()"
              class="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 text-sm"
            >
              Aceptar
            </button>
          </div>

        </div>

      </div>
    }
  `
})
export class ErrorModalComponent {
  error = inject(ErrorModalService);
}