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
} from '../../../api/models/home';

type TipoFiltro = 'todos' | 'noticias' | 'servicios';
type TipoEdicion = 'noticia' | 'servicio';

interface EditFormState {
  id_informacion: number;
  titulo: string;
  descripcion: string;
  id_categoria: number | null;
  imagen_url: string;
  fecha_publicacion: string;
}

interface NuevoItemState {
  titulo: string;
  descripcion: string;
  id_categoria: number | null;
  imagen_url: string;
  fecha_publicacion: string;
}

@Component({
  selector: 'app-info-home-admin',
  imports: [DatePipe],
  templateUrl: './contenidos-home.html',
  styleUrl: './contenidos-home.css',
})
export class ContenidosHome implements OnInit {

  constructor(private homeService: HomeService, private productoService: ProductoService) {}

  ngOnInit(): void {
    this.cargarCategorias();
  }

  // ── Recursos ──────────────────────────────────────────────────────
  homeResource = rxResource({
    stream: () => this.homeService.obtenerInfoHome(),
  });

  // ── Estado categorías ─────────────────────────────────────────────
  categorias           = signal<Categoria[]>([]);
  cargandoCategorias   = signal(false);
  nuevaCategoriaNombre = signal('');
  agregandoCategoria   = signal(false);

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
  searchQuery  = signal('');
  filtroTipo   = signal<TipoFiltro>('todos');
  editandoId   = signal<number | null>(null);
  editandoTipo = signal<TipoEdicion | null>(null);
  guardando    = signal(false);
  insertando   = signal(false);
  nuevaCard    = signal(false);
  nuevoTipo    = signal<TipoEdicion>('noticia');

  editForm = signal<EditFormState | null>(null);

  nuevoItem = signal<NuevoItemState>({
    titulo: '',
    descripcion: '',
    id_categoria: null,
    imagen_url: '',
    fecha_publicacion: '',
  });

  // ── Computed filtrados ────────────────────────────────────────────
  noticiasFiltradas = computed(() => {
    const query    = this.searchQuery().toLowerCase().trim();
    const noticias = this.homeResource.value()?.noticias ?? [];
    if (!query) return noticias;
    return noticias.filter(n =>
      n.titulo.toLowerCase().includes(query) ||
      n.descripcion?.toLowerCase().includes(query)
    );
  });

  serviciosFiltrados = computed(() => {
    const query     = this.searchQuery().toLowerCase().trim();
    const servicios = this.homeResource.value()?.servicios ?? [];
    if (!query) return servicios;
    return servicios.filter(s =>
      s.titulo.toLowerCase().includes(query) ||
      s.descripcion?.toLowerCase().includes(query)
    );
  });

  // ── Edición ───────────────────────────────────────────────────────
  abrirEditarNoticia(item: NoticiasHome) {
    this.editandoId.set(item.id_informacion);
    this.editandoTipo.set('noticia');
    this.editForm.set({
      id_informacion:    item.id_informacion,
      titulo:            item.titulo,
      descripcion:       item.descripcion,
      id_categoria:      item.id_categoria,
      imagen_url:        item.imagen_url,
      fecha_publicacion: item.fecha_publicacion,
    });
  }

  abrirEditarServicio(item: ServicioHome) {
    this.editandoId.set(item.id_informacion);
    this.editandoTipo.set('servicio');
    this.editForm.set({
      id_informacion:    item.id_informacion,
      titulo:            item.titulo,
      descripcion:       item.descripcion,
      id_categoria:      item.id_categoria,
      imagen_url:        item.imagen_url,
      fecha_publicacion: '',
    });
  }

  cancelarEditar() {
    this.editandoId.set(null);
    this.editandoTipo.set(null);
    this.editForm.set(null);
  }

  updateEditField(field: keyof Omit<EditFormState, 'id_informacion'>, value: string) {
    const form = this.editForm();
    if (!form) return;
    const parsed = field === 'id_categoria' ? (Number(value) || null) : value;
    this.editForm.set({ ...form, [field]: parsed });
  }

  guardarEdicion() {
    const form = this.editForm();
    if (!form) return;
    this.guardando.set(true);

    const payload: infoHomeRequest = {
      titulo:            form.titulo,
      descripcion:       form.descripcion,
      id_categoria:      form.id_categoria ?? 0,
      imagen_url:        form.imagen_url,
      fecha_publicacion: form.fecha_publicacion,
    };

    this.homeService.actualizarInfoHome(form.id_informacion, payload).subscribe({
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
    this.nuevoItem.set({
      titulo:            '',
      descripcion:       '',
      id_categoria:      null,
      imagen_url:        '',
      fecha_publicacion: '',
    });
  }

  cancelarNueva() {
    this.nuevaCard.set(false);
  }

  updateNuevoField(field: keyof NuevoItemState, value: string) {
    const parsed = field === 'id_categoria' ? (Number(value) || null) : value;
    this.nuevoItem.set({ ...this.nuevoItem(), [field]: parsed as any });
  }

  guardarNuevo() {
    const item = this.nuevoItem();
    this.insertando.set(true);

    const payload: infoHomeRequest = {
      titulo:            item.titulo,
      descripcion:       item.descripcion,
      id_categoria:      item.id_categoria ?? 0,
      imagen_url:        item.imagen_url,
      fecha_publicacion: this.nuevoTipo() === 'noticia' ? item.fecha_publicacion : '',
    };

    this.homeService.insertarInfoHome(payload).subscribe({
      next: () => {
        this.insertando.set(false);
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
}