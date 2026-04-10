import { Component, signal, computed, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { HomeService } from '../../../core/services/home-service';
import { ProductoService } from '../../../core/services/producto-service';
import { Categoria } from '../../../api/models/producto';
import {
  ServicioHome,
  NoticiasHome,
  infoHomeRequest,
  infoHomeEdit,
} from '../../../api/models/home';

type TipoFiltro = 'todos' | 'noticias' | 'servicios';
type TipoEdicion = 'noticia' | 'servicio';

@Component({
  selector: 'app-info-home-admin',
  imports: [DatePipe],
  templateUrl: './contenidos-home.html',
  styleUrl: './contenidos-home.css',
})
export class ContenidosHome implements OnInit {
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
  nuevaCategoriaNombre = signal('');
  agregandoCategoria = signal(false);

  cargarCategorias(): void {
    this.cargandoCategorias.set(true);
    this.productoService.obtenerCategorias().subscribe({
      next: (cats) => {
        this.categorias.set(cats);
        this.cargandoCategorias.set(false);
      },
      error: () => {
        console.error('Error al cargar categorías');
        this.cargandoCategorias.set(false);
      },
    });
  }

  agregarCategoria(): void {
    const nombre = this.nuevaCategoriaNombre().trim();
    if (!nombre) return;
    this.agregandoCategoria.set(true);
    this.productoService.insertarCategoria(nombre).subscribe({
      next: () => {
        this.cargarCategorias();
        this.nuevaCategoriaNombre.set('');
        this.agregandoCategoria.set(false);
      },
      error: () => {
        console.error('Error al agregar categoría');
        this.agregandoCategoria.set(false);
      },
    });
  }

  // ── Estado UI ─────────────────────────────────────────────────────
  searchQuery = signal('');
  filtroTipo = signal<TipoFiltro>('todos');
  editandoId = signal<number | null>(null);
  editandoTipo = signal<TipoEdicion | null>(null);
  guardando = signal(false);
  insertando = signal(false);
  nuevaCard = signal(false);
  nuevoTipo = signal<TipoEdicion>('noticia');

  editForm = signal<infoHomeEdit | null>(null);

  nuevoItem = signal<infoHomeRequest>({
    titulo: '',
    descripcion: '',
    id_categoria: 0,
    imagen_url: '',
    fecha_publicacion: '',
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
      (n) => n.titulo.toLowerCase().includes(query) || n.descripcion?.toLowerCase().includes(query),
    );
  });

  serviciosFiltrados = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const servicios = this.homeResource.value()?.servicios ?? [];
    if (!query) return servicios;
    return servicios.filter(
      (s) => s.titulo.toLowerCase().includes(query) || s.descripcion?.toLowerCase().includes(query),
    );
  });

  // ── Edición ───────────────────────────────────────────────────────
  abrirEditarNoticia(item: NoticiasHome) {
    this.editandoId.set(item.id_informacion);
    this.editandoTipo.set('noticia');
    this.editImagenArchivo = null;
    this.editImagenPreview.set(item.imagen_url ?? null); // muestra la imagen actual

    this.editForm.set({
      id_informacion: item.id_informacion,
      titulo: item.titulo,
      descripcion: item.descripcion,
      id_categoria: item.id_categoria,
      imagen_url: item.imagen_url,
      fecha_publicacion: item.fecha_publicacion,
    });
  }

  abrirEditarServicio(item: ServicioHome) {
    this.editandoId.set(item.id_informacion);
    this.editandoTipo.set('servicio');
    this.editImagenArchivo = null;
    this.editImagenPreview.set(item.imagen_url ?? null);
    this.editForm.set({
      id_informacion: item.id_informacion,
      titulo: item.titulo,
      descripcion: item.descripcion,
      id_categoria: item.id_categoria,
      imagen_url: item.imagen_url,
      fecha_publicacion: '',
    });
  }

  cancelarEditar() {
    this.editandoId.set(null);
    this.editandoTipo.set(null);
    this.editForm.set(null);
    this.editImagenArchivo = null;
    this.editImagenPreview.set(null);
  }

  updateEditField(field: keyof Omit<infoHomeEdit, 'id_informacion'>, value: string) {
    const form = this.editForm();
    if (!form) return;
    const parsed = field === 'id_categoria' ? Number(value) || null : value;
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

    this.homeService.actualizarInfoHome(payload).subscribe({
      next: () => {
        this.guardando.set(false);
        this.cancelarEditar();
        this.homeResource.reload();
      },
      error: (err) => {
        console.error('Error al actualizar', err);
        alert('Error al actualizar el contenido');
        this.guardando.set(false);
      },
    });
  }

  // ── Eliminar ──────────────────────────────────────────────────────
  eliminar(id: number) {
    if (!confirm('¿Seguro que querés eliminar este contenido?')) return;
    this.homeService.eliminarInfoHome(id).subscribe({
      next: () => this.homeResource.reload(),
      error: (err) => {
        console.error('Error al eliminar', err);
        alert('Error al eliminar el contenido');
      },
    });
  }

  // ── Nuevo ítem ────────────────────────────────────────────────────
  abrirNueva() {
    this.nuevaCard.set(true);
    this.nuevoImagenArchivo = null;
    this.nuevoImagenPreview.set(null);
    this.nuevoItem.set({
      titulo: '',
      descripcion: '',
      id_categoria: 0,
      imagen_url: '',
      fecha_publicacion: '',
    });
  }

  cancelarNueva() {
    this.nuevaCard.set(false);
  }

  updateNuevoField(field: keyof infoHomeEdit, value: string) {
    const parsed = field === 'id_categoria' ? Number(value) || null : value;
    this.nuevoItem.set({ ...this.nuevoItem(), [field]: parsed as any });
  }

  guardarNuevo() {
    const item = this.nuevoItem();
    this.insertando.set(true);
    const fechaPublicacion =
      this.nuevoTipo() === 'noticia' && item.fecha_publicacion?.trim()
        ? item.fecha_publicacion
        : null;
    const payload: infoHomeRequest = {
      titulo: item.titulo,
      descripcion: item.descripcion,
      id_categoria: item.id_categoria ?? 0,
      imagen_url: '',
      fecha_publicacion: fechaPublicacion,
    };

    this.homeService.insertarInfoHome(this.nuevoImagenArchivo, payload).subscribe({
      next: () => {
        this.insertando.set(false);
        this.nuevoImagenArchivo = null;
        this.nuevoImagenPreview.set(null);
        this.cancelarNueva();
        this.homeResource.reload();
      },
      error: (err) => {
        console.error('Error al insertar', err);
        alert('Error al guardar el contenido');
        this.insertando.set(false);
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
}
