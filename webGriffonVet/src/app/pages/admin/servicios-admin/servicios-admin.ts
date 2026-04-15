import { Component, signal, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { rxResource } from "@angular/core/rxjs-interop";
import { ServicioService } from "../../../core/services/servicio-service";
import {
  servicio,
  servicioRequest,
  precio,
} from "../../../api/models/servicio";
import { ToastService } from "../../../core/services/toast.service";
import { ErrorModalService } from "../../../core/services/error-modal";
import { inject } from "@angular/core";
@Component({
  selector: "app-servicios-admin",
  imports: [CommonModule, FormsModule],
  templateUrl: "./servicios-admin.html",
  styleUrl: "./servicios-admin.css",
})
export class ServiciosAdmin {
  private toast = inject(ToastService);
  private errorModal = inject(ErrorModalService);

  readonly tamanios = ["CHICO", "MEDIANO", "GRANDE", "MUY GRANDE"] as const;

  searchQuery = signal("");
  editandoId = signal<number | null>(null);
  guardando = signal(false);
  insertando = signal(false);
  modalEliminar = signal(false);
  servicioAEliminar = signal<number | null>(null);
  // Estado temporal para edición inline
  editForm = signal<servicio | null>(null);

  // Estado para nueva card
  nuevaCard = signal(false);
  nuevoServicio = signal<servicioRequest>({
    nombre: "",
    descripcion: "",
    precios: [{ tamanio: "CHICO", precio: "", duracion: 0 as any }],
  });

  constructor(private servicioService: ServicioService) {}

  serviciosResource = rxResource({
    stream: () => this.servicioService.getServicios(),
  });

  serviciosFiltrados = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const servicios = this.serviciosResource.value() ?? [];
    if (!query) return servicios;
    return servicios.filter(
      (s) =>
        s.nombre.toLowerCase().includes(query) ||
        s.descripcion?.toLowerCase().includes(query),
    );
  });

  // ── Edición inline ──────────────────────────────────────────────
  abrirEditar(s: servicio) {
    this.editandoId.set(s.id_servicio);
    // Deep clone para no mutar la lista
    this.editForm.set(JSON.parse(JSON.stringify(s)));
  }

  cancelarEditar() {
    this.editandoId.set(null);
    this.editForm.set(null);
  }

  guardarEdicion() {
    const form = this.editForm();
    if (!form) return;
    this.guardando.set(true);
    this.servicioService.actualizarServicio(form).subscribe({
      next: () => {
        this.guardando.set(false);
        this.cancelarEditar();
        this.serviciosResource.reload();
         this.toast.mostrar('Servicio actualizado correctamente');
      },
      error: (err) => {
        this.guardando.set(false);

      const mensaje =
        err?.error?.mensaje || 'Error al actualizar el servicio';

      this.errorModal.mostrar(mensaje);
      },
    });
  }

  agregarPrecioEdicion() {
    const form = this.editForm();
    if (!form) return;
    this.editForm.set({
      ...form,
      precios: [
        ...form.precios,
        { tamanio: "Chico", precio: "", duracion: 0 as any },
      ],
    });
  }

  eliminarPrecioEdicion(index: number) {
    const form = this.editForm();
    if (!form) return;
    const precios = form.precios.filter((_, i) => i !== index);
    this.editForm.set({ ...form, precios });
  }

  updateEditField(
    field: keyof Pick<servicio, "nombre" | "descripcion">,
    value: string,
  ) {
    const form = this.editForm();
    if (!form) return;
    this.editForm.set({ ...form, [field]: value });
  }

  updateEditPrecio(index: number, field: keyof precio, value: string) {
    const form = this.editForm();
    if (!form) return;
    const precios = form.precios.map((p, i) =>
      i === index ? { ...p, [field]: value } : p,
    );
    this.editForm.set({ ...form, precios });
  }

  // ── Eliminar ────────────────────────────────────────────────────

  eliminar(id: number) {
    this.servicioAEliminar.set(id);
    this.modalEliminar.set(true);
  }

  // cancelar
  cancelarEliminar() {
    this.modalEliminar.set(false);
    this.servicioAEliminar.set(null);
  }

  // confirmar
  eliminarConfirmado() {
    const id = this.servicioAEliminar();
    if (!id) return;

    this.servicioService.eliminarServicio(id).subscribe({
      next: () => {
        this.toast.mostrar("Servicio eliminado correctamente");
        this.serviciosResource.reload();
        this.cancelarEliminar();
      },
      error: (err) => {
        const mensaje = err?.error?.mensaje || "Error al eliminar el servicio";
        this.errorModal.mostrar(mensaje);
        this.cancelarEliminar();
      },
    });
  }

  // ── Insertar nuevo ──────────────────────────────────────────────
  abrirNueva() {
    this.nuevaCard.set(true);
    this.nuevoServicio.set({
      nombre: "",
      descripcion: "",
      precios: [{ tamanio: "Chico", precio: "", duracion: 0 as any }],
    });
  }

  cancelarNueva() {
    this.nuevaCard.set(false);
  }

  agregarPrecioNuevo() {
    const s = this.nuevoServicio();
    this.nuevoServicio.set({
      ...s,
      precios: [
        ...s.precios,
        { tamanio: "Chico", precio: "", duracion: 0 as any },
      ],
    });
  }

  eliminarPrecioNuevo(index: number) {
    const s = this.nuevoServicio();
    this.nuevoServicio.set({
      ...s,
      precios: s.precios.filter((_, i) => i !== index),
    });
  }

  updateNuevoField(
    field: keyof Pick<servicioRequest, "nombre" | "descripcion">,
    value: string,
  ) {
    this.nuevoServicio.set({ ...this.nuevoServicio(), [field]: value });
  }

  updateNuevoPrecio(index: number, field: keyof precio, value: string) {
    const s = this.nuevoServicio();
    const precios = s.precios.map((p, i) =>
      i === index ? { ...p, [field]: value } : p,
    );
    this.nuevoServicio.set({ ...s, precios });
  }

  guardarNuevo() {
    this.insertando.set(true);
    this.servicioService.insertarServicio(this.nuevoServicio()).subscribe({
      next: () => {
        this.insertando.set(false);
        this.cancelarNueva();
        this.serviciosResource.reload();
          this.toast.mostrar('Servicio creado correctamente');
      },
      error: (err) => {
        this.insertando.set(false);

      const mensaje =
        err?.error?.mensaje || 'Error al guardar el servicio';

      this.errorModal.mostrar(mensaje);
      },
    });
  }
}
