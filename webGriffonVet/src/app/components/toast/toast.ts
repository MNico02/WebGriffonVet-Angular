import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (toast.visible()) {
      <div class="fixed top-6 right-6 z-50">

        <div
          class="px-5 py-3 rounded-lg shadow-lg text-white text-sm font-semibold animate-fade-in"
          [ngClass]="{
            'bg-green-500': toast.tipo() === 'success',
            'bg-red-500': toast.tipo() === 'error'
          }"
        >
          {{ toast.mensaje() }}
        </div>

      </div>
    }
  `
})
export class ToastComponent {
  toast = inject(ToastService);
}