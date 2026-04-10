import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { NoticiasHome } from '../../../api/models/home';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-blog',
  imports: [CommonModule],
  templateUrl: './blog.html',
  styleUrl: './blog.css',
})
export class Blog implements OnInit {
  private apiUrl = environment.apiUrl;

  readonly ITEMS_POR_PAGINA = 6;

  noticias = signal<NoticiasHome[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  paginaActual = signal(1);
  categoriaActiva = signal('Todos');
  busqueda = signal('');

  categorias = computed(() => {
    const cats = this.noticias().map(n => n.categoria);
    return ['Todos', ...new Set(cats)];
  });

  noticiasFiltradas = computed(() => {
    let lista = this.noticias();
    if (this.categoriaActiva() !== 'Todos') {
      lista = lista.filter(n => n.categoria === this.categoriaActiva());
    }
    const q = this.busqueda().toLowerCase().trim();
    if (q) {
      lista = lista.filter(n =>
        n.titulo.toLowerCase().includes(q) ||
        n.descripcion.toLowerCase().includes(q)
      );
    }
    return lista;
  });

  totalPaginas = computed(() =>
    Math.ceil(this.noticiasFiltradas().length / this.ITEMS_POR_PAGINA)
  );

  paginas = computed(() =>
    Array.from({ length: this.totalPaginas() }, (_, i) => i + 1)
  );

  noticiasPagina = computed(() => {
    const inicio = (this.paginaActual() - 1) * this.ITEMS_POR_PAGINA;
    return this.noticiasFiltradas().slice(inicio, inicio + this.ITEMS_POR_PAGINA);
  });

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<{ success: number; mensaje: string; data: NoticiasHome[] }>(
      `${this.apiUrl}/ObtenerNoticias`
    ).pipe(
      map(res => res.data ?? [])
    ).subscribe({
      next: (data) => {
        this.noticias.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar las noticias.');
        this.loading.set(false);
      }
    });
  }

  seleccionarCategoria(cat: string) {
    this.categoriaActiva.set(cat);
    this.paginaActual.set(1);
  }

  onBusqueda(event: Event) {
    this.busqueda.set((event.target as HTMLInputElement).value);
    this.paginaActual.set(1);
  }

  irAPagina(n: number) {
    if (n < 1 || n > this.totalPaginas()) return;
    this.paginaActual.set(n);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  calcularLectura(descripcion: string): string {
    const palabras = descripcion.trim().split(/\s+/).length;
    const minutos = Math.max(1, Math.round(palabras / 200));
    return `${minutos} min lectura`;
  }

  formatearFecha(fecha: string | null): string {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-AR', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  }
}