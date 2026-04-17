import { Component, signal, computed, OnInit } from "@angular/core";
import { DatePipe } from "@angular/common";
import { rxResource } from "@angular/core/rxjs-interop";
import { HomeService } from "../../../core/services/home-service";
import { ProductoService } from "../../../core/services/producto-service";
import { Categoria } from "../../../api/models/producto";
import { ToastService } from "../../../core/services/toast.service";
import { ErrorModalService } from "../../../core/services/error-modal";
import { inject } from "@angular/core";
import { ChangeDetectorRef } from "@angular/core";
import {
  ServicioHome,
  NoticiasHome,
  infoHomeRequest,
  infoHomeEdit,
} from "../../../api/models/home";
import { ConfirmarEliminarModal } from "../../../components/confirmar-eliminar-modal/confirmar-eliminar-modal";
import { SelectConCreacion } from "../../../layouts/admin/select-con-creacion/select-con-creacion";
import { ItemSeleccionable } from "../../../api/models/itemSeleccionable";

type TipoFiltro = "todos" | "noticias" | "servicios";
type TipoEdicion = "noticia" | "servicio";

@Component({
  selector: "app-info-home-admin",
  imports: [DatePipe, ConfirmarEliminarModal, SelectConCreacion],
  templateUrl: "./contenidos-home.html",
  styleUrl: "./contenidos-home.css",
})
export class ContenidosHome implements OnInit {
  private toast = inject(ToastService);
  private errorModal = inject(ErrorModalService);
  private cdr = inject(ChangeDetectorRef);

  constructor(
    private homeService: HomeService,
    private productoService: ProductoService,
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
  }

  // ── Recursos ──────────────────────────────────────────────────────
  homeResource = rxResource({
    stream: () => this.homeService.obtenerInfoHome(),
  });

  // ── Estado categorías ─────────────────────────────────────────────
  categorias = signal<Categoria[]>([]);
  cargandoCategorias = signal(false);
  agregandoCategoria = signal(false);

  // FIX 1: computed categoriasComoItems() faltaba — el template lo usaba pero no existía
 categoriasComoItems = computed(() =>
    this.categorias().map(c => ({ id: c.id_categoria, nombre: c.nombre }))
  );
  idCategoriaEdicionNoticia = signal<number>(0);
  idCategoriaEdicionServicio = signal<number>(0);
  idCategoriaNuevo = signal<number>(0);

  cargarCategorias(): void {
    this.cargandoCategorias.set(true);
    this.productoService.obtenerCategorias().subscribe({
      next: (cats) => {
        this.categorias.set(cats);
        this.cargandoCategorias.set(false);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.cargandoCategorias.set(false);
        const mensaje = err?.error?.mensaje || "Error al cargar categorías";
        this.errorModal.mostrar(mensaje);
        this.cdr.detectChanges();
      },
    });
  }

  // ── Estado UI ─────────────────────────────────────────────────────
  searchQuery = signal("");
  filtroTipo = signal<TipoFiltro>("todos");
  editandoId = signal<number | null>(null);
  editandoTipo = signal<TipoEdicion | null>(null);
  guardando = signal(false);
  insertando = signal(false);
  nuevaCard = signal(false);
  nuevoTipo = signal<TipoEdicion>("noticia");

  editForm = signal<infoHomeEdit | null>(null);
  modalEliminar = signal(false);
  itemAEliminar = signal<infoHomeEdit | null>(null);

  mensajeEliminar = computed(
    () =>
      `¿Seguro que querés eliminar el contenido "${this.itemAEliminar()?.titulo}"?`,
  );

  nuevoItem = signal<infoHomeRequest>({
    titulo: "",
    descripcion: "",
    id_categoria: 0,
    imagen_url: "",
    fecha_publicacion: "",
  });
  nuevoImagenPreview = signal<string | null>(null);
  nuevoImagenArchivo: File | null = null;

  // ── Imagen edición ────────────────────────────────────────────────
  editImagenPreview = signal<string | null>(null);
  editImagenArchivo: File | null = null;

  // ── Computed filtrados ────────────────────────────────────────────
  noticiasFiltradas = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const noticias = this.homeResource.value()?.noticias ?? [];
    if (!query) return noticias;
    return noticias.filter(
      (n) =>
        n.titulo.toLowerCase().includes(query) ||
        n.descripcion?.toLowerCase().includes(query),
    );
  });

  serviciosFiltrados = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const servicios = this.homeResource.value()?.servicios ?? [];
    if (!query) return servicios;
    return servicios.filter(
      (s) =>
        s.titulo.toLowerCase().includes(query) ||
        s.descripcion?.toLowerCase().includes(query),
    );
  });

  // ── Edición ───────────────────────────────────────────────────────
  abrirEditarNoticia(item: NoticiasHome) {
    this.editandoId.set(item.id_informacion);
    this.editandoTipo.set("noticia");
    this.editImagenArchivo = null;
    this.editImagenPreview.set(item.imagen_url ?? null);

    this.editForm.set({
      id_informacion: item.id_informacion,
      titulo: item.titulo,
      descripcion: item.descripcion,
      id_categoria: item.id_categoria,
      imagen_url: item.imagen_url,
      fecha_publicacion: item.fecha_publicacion,
    });

    // FIX 2: sincronizar la signal del select con el valor actual
    this.idCategoriaEdicionNoticia.set(0);
    setTimeout(() => this.idCategoriaEdicionNoticia.set(item.id_categoria));
  }

  abrirEditarServicio(item: ServicioHome) {
    this.editandoId.set(item.id_informacion);
    this.editandoTipo.set("servicio");
    this.editImagenArchivo = null;
    this.editImagenPreview.set(item.imagen_url ?? null);

    this.editForm.set({
      id_informacion: item.id_informacion,
      titulo: item.titulo,
      descripcion: item.descripcion,
      id_categoria: item.id_categoria,
      imagen_url: item.imagen_url,
      fecha_publicacion: "",
    });

    // FIX 2: sincronizar la signal del select con el valor actual
    this.idCategoriaEdicionServicio.set(0);
    setTimeout(() => this.idCategoriaEdicionServicio.set(item.id_categoria));
  }

  cancelarEditar() {
    this.editandoId.set(null);
    this.editandoTipo.set(null);
    this.editForm.set(null);
    this.editImagenArchivo = null;
    this.editImagenPreview.set(null);
  }

  updateEditField(
    field: keyof Omit<infoHomeEdit, "id_informacion">,
    // FIX 3: acepta string | number para que las llamadas con number sean válidas
    value: string | number,
  ) {
    const form = this.editForm();
    if (!form) return;
    const parsed =
      field === "id_categoria" ? Number(value) || 0 : String(value);
    this.editForm.set({ ...form, [field]: parsed });
  }

  guardarEdicion() {
    const form = this.editForm();
    if (!form) return;
    this.guardando.set(true);

    const payload: infoHomeEdit = {
      id_informacion: form.id_informacion,
      titulo: form.titulo,
      descripcion: form.descripcion,
      id_categoria: form.id_categoria ?? 0,
      imagen_url: form.imagen_url,
      fecha_publicacion: form.fecha_publicacion,
    };

    // FIX 4: pasar el archivo de imagen al servicio si el usuario lo cambió
    this.homeService
      .actualizarInfoHome( payload, this.editImagenArchivo)
      .subscribe({
        next: () => {
          this.guardando.set(false);
          this.cancelarEditar();
          this.homeResource.reload();
          this.toast.mostrar("Contenido actualizado correctamente");
        },
        error: (err) => {
          this.guardando.set(false);
          const mensaje =
            err?.error?.mensaje || "Error al actualizar el contenido";
          this.errorModal.mostrar(mensaje);
        },
      });
  }

  // ── Eliminar ──────────────────────────────────────────────────────
  eliminar(item: NoticiasHome | ServicioHome) {
    this.itemAEliminar.set(item as infoHomeEdit);
    this.modalEliminar.set(true);
  }

  cancelarEliminar() {
    this.modalEliminar.set(false);
    this.itemAEliminar.set(null);
  }

  eliminarConfirmado() {
    const item = this.itemAEliminar();
    if (!item) return;

    this.homeService.eliminarInfoHome(item.id_informacion).subscribe({
      next: () => {
        this.toast.mostrar("Contenido eliminado correctamente");
        this.homeResource.reload();
        this.cancelarEliminar();
      },
      error: (err) => {
        const mensaje = err?.error?.mensaje || "Error al eliminar el contenido";
        this.errorModal.mostrar(mensaje);
        this.cancelarEliminar();
      },
    });
  }

  // ── Nuevo ítem ────────────────────────────────────────────────────
  abrirNueva() {
    this.nuevaCard.set(true);
    this.nuevoImagenArchivo = null;
    this.nuevoImagenPreview.set(null);
    this.idCategoriaNuevo.set(0);
    this.nuevoItem.set({
      titulo: "",
      descripcion: "",
      id_categoria: 0,
      imagen_url: "",
      fecha_publicacion: "",
    });
  }

  cancelarNueva() {
    this.nuevaCard.set(false);
  }

  // FIX 5: tipo correcto — keyof infoHomeRequest en vez de infoHomeEdit
  updateNuevoField(field: keyof infoHomeRequest, value: string | number) {
    const parsed =
      field === "id_categoria" ? Number(value) || 0 : String(value);
    this.nuevoItem.set({ ...this.nuevoItem(), [field]: parsed as any });
  }

  guardarNuevo() {
    const item = this.nuevoItem();
    this.insertando.set(true);
    const fechaPublicacion =
      this.nuevoTipo() === "noticia" && item.fecha_publicacion?.trim()
        ? item.fecha_publicacion
        : null;

    const payload: infoHomeRequest = {
      titulo: item.titulo,
      descripcion: item.descripcion,
      id_categoria: item.id_categoria ?? 0,
      imagen_url: "",
      fecha_publicacion: fechaPublicacion,
    };

    this.homeService
      .insertarInfoHome(this.nuevoImagenArchivo, payload)
      .subscribe({
        next: () => {
          this.insertando.set(false);
          this.nuevoImagenArchivo = null;
          this.nuevoImagenPreview.set(null);
          this.cancelarNueva();
          this.homeResource.reload();
          this.toast.mostrar("Contenido creado correctamente");
        },
        error: (err) => {
          this.insertando.set(false);
          const mensaje =
            err?.error?.mensaje || "Error al guardar el contenido";
          this.errorModal.mostrar(mensaje);
        },
      });
  }

  // ── Handlers imagen nuevo ─────────────────────────────────────────
  onNuevoImagenSeleccionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.nuevoImagenArchivo = file;
    const reader = new FileReader();
    reader.onload = () => this.nuevoImagenPreview.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  quitarNuevoImagen(): void {
    this.nuevoImagenArchivo = null;
    this.nuevoImagenPreview.set(null);
  }

  // ── Handlers imagen edición ───────────────────────────────────────
  onEditImagenSeleccionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.editImagenArchivo = file;
    const reader = new FileReader();
    reader.onload = () => this.editImagenPreview.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  quitarEditImagen(): void {
    this.editImagenArchivo = null;
    this.editImagenPreview.set(null);
  }

  // ── Handlers categorías ───────────────────────────────────────────
  onCategoriaSeleccionadaEdicion(item: ItemSeleccionable) {
    this.updateEditField("id_categoria", item.id);
  }

  onCategoriaSeleccionadaNuevo(item: ItemSeleccionable) {
    this.updateNuevoField("id_categoria", item.id);
  }

  onNuevaCategoria(nombre: string) {
    this.agregandoCategoria.set(true);
    const idsAntes = this.categorias().map((c) => c.id_categoria);

    this.productoService.insertarCategoria(nombre).subscribe({
      next: () => {
        this.toast.mostrar("Categoría agregada correctamente");
        this.productoService.obtenerCategorias().subscribe({
          next: (data) => {
            this.categorias.set(data ?? []);
            this.agregandoCategoria.set(false);

            const nueva = data.find((c) => !idsAntes.includes(c.id_categoria));
            if (nueva) {
              // FIX 6: updateEditField ahora acepta number, no hay cast incorrecto
              this.idCategoriaEdicionNoticia.set(nueva.id_categoria);
              this.idCategoriaEdicionServicio.set(nueva.id_categoria);
              this.idCategoriaNuevo.set(nueva.id_categoria);
              this.updateEditField("id_categoria", nueva.id_categoria);
              this.updateNuevoField("id_categoria", nueva.id_categoria);
            }
          },
          error: (err) => {
            this.agregandoCategoria.set(false);
            this.errorModal.mostrar(
              err?.error?.mensaje || "Error al recargar categorías",
            );
          },
        });
      },
      error: (err) => {
        this.agregandoCategoria.set(false);
        this.errorModal.mostrar(err?.error?.mensaje || "Error al agregar");
      },
    });
  }
}