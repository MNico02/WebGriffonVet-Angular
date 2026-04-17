import { Component, input, output, inject, OnInit,computed, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HistorialClinicoService } from "../../../core/services/historial-clinico-service";
import {
  alergia,
  alergiaMascotaRequest,
} from "../../../api/models/historialClinico";

import { ToastService } from "../../../core/services/toast.service";
import { ErrorModalService } from "../../../core/services/error-modal";
import { SelectConCreacion } from "../select-con-creacion/select-con-creacion";
import { ItemSeleccionable } from "../../../api/models/itemSeleccionable";

@Component({
  selector: "app-nueva-alergia",
  imports: [CommonModule, FormsModule, SelectConCreacion],
  templateUrl: "./nueva-alergia.html",
  styleUrl: "./nueva-alergia.css",
})
export class NuevaAlergia implements OnInit {
  mascotaId = input.required<number>();
  usuarioId = input.required<number>();
  private service = inject(HistorialClinicoService);

  private toast = inject(ToastService);
  private errorModal = inject(ErrorModalService);

  cerrar = output<void>();
  alergiaGuardada = output<void>();

  alergias= signal<alergia[]>([]);
  cargandoAlergias = signal(false);
  idAlergiaSeleccionada = signal<number>(0);
  nuevaAlergiaNombre = "";
  agregandoAlergia = false;

  severidades = ["LEVE", "MODERADA", "GRAVE"];
  mostrarNuevaAlergia = false;
  form: alergiaMascotaRequest = {
    id_mascota: 0,
    id_usuario: 0,
    id_alergia: 0,
    severidad: "",
    observaciones: "",
  };
  alergiasComoItem = computed(() =>
    this.alergias().map(c => ({ id: c.id_alergia, nombre: c.nombre }))
  );
  ngOnInit() {
    this.cargarAlergias();
  }

  cargarAlergias() {
    this.cargandoAlergias.set(true);
    this.service.obtenerAlergia().subscribe({
      next: (data: alergia[]) => {
       this.alergias.set(data ?? []);
        this.cargandoAlergias.set(false);
        this.agregandoAlergia = false;
        
      },
      error: (err) => {
        this.cargandoAlergias.set(false);
        this.agregandoAlergia = false;
        
        const mensaje =
          err?.error?.mensaje || "No se pudieron cargar las alergias";
        this.errorModal.mostrar(mensaje);
      },
    });
  }

  /*insertarAlergia() {
    if (!this.nuevaAlergiaNombre.trim()) return;

    this.agregandoAlergia = true;

    const nombre = this.nuevaAlergiaNombre.trim();

    this.service.insertarAlergiaCatalogo(nombre).subscribe({
      next: () => {
        this.nuevaAlergiaNombre = "";
        this.agregandoAlergia = false;

        this.mostrarNuevaAlergia = false;
        this.toast.mostrar("Alergia agregada correctamente");
        this.cargarAlergias();

        setTimeout(() => {
          if (!this.alergias.length) return;

          const ultima = this.alergias.reduce((max, a) =>
            a.id_alergia > max.id_alergia ? a : max,
          );

          this.form.id_alergia = ultima.id_alergia;
        }, 300);
      },
      error: (err) => {
        this.agregandoAlergia = false;
        const mensaje = err?.error?.mensaje || "Error al agregar la alergia";
        this.errorModal.mostrar(mensaje);
      },
    });
  }*/

  onAlergiaSeleccionada(item: ItemSeleccionable) {
    this.form.id_alergia = item.id;
  }

  onNuevaAlergia(nombre: string) {
    this.agregandoAlergia=true;
    const idsAntes = this.alergias().map(c => c.id_alergia);

    this.service.insertarAlergiaCatalogo(nombre).subscribe({
      next: () => {
        this.toast.mostrar('Enfermedad agregada correctamente');
        this.service.obtenerAlergia().subscribe({
          next: (data) => {
            this.alergias.set(data ?? []);
            this.agregandoAlergia=false;
            const nueva = data.find(c => !idsAntes.includes(c.id_alergia));
            if (nueva) {
              this.idAlergiaSeleccionada.set(nueva.id_alergia);
              this.form.id_alergia = nueva.id_alergia;
            }
          }
        });
      },
      error: (err) => {
       this.agregandoAlergia=false;
        this.errorModal.mostrar(err?.error?.mensaje || 'Error al agregar');
      }
    });
  }





  guardar() {
    const payload: alergiaMascotaRequest = {
      ...this.form,
      id_usuario: this.usuarioId(),
      id_mascota: this.mascotaId(),
    };

    console.log("Payload alergia:", payload);

    this.service.insertarAlergia(payload).subscribe({
      next: () => {
        this.toast.mostrar("Alergia registrada correctamente");

        this.alergiaGuardada.emit();
        this.cerrar.emit();
      },
      error: (err) => {
        const mensaje = err?.error?.mensaje || "Error al guardar la alergia";
        this.errorModal.mostrar(mensaje);
      },
    });
  }

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains("modal-overlay")) {
      this.cerrar.emit();
    }
  }
  getSeveridadActivaClass(s: string): string {
    const clases: Record<string, string> = {
      LEVE: "flex-1 py-2 rounded-lg text-xs font-bold border-2 border-tertiary bg-tertiary-container/30 text-tertiary transition-all",
      MEDIA:
        "flex-1 py-2 rounded-lg text-xs font-bold border-2 border-secondary bg-secondary-container/30 text-secondary transition-all",
      ALTA: "flex-1 py-2 rounded-lg text-xs font-bold border-2 border-error bg-error-container/30 text-error transition-all",
    };
    return clases[s] ?? "";
  }
}
