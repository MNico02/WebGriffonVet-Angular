import {
  Component,
  EventEmitter,
  inject,
  OnInit,
  Output,
  signal,
  computed
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ProductoService } from "../../../core/services/producto-service";
import { Categoria, ProductoRequest } from "../../../api/models/producto";
import { ToastService } from "../../../core/services/toast.service";
import { ErrorModalService } from "../../../core/services/error-modal";
import { ItemSeleccionable } from "../../../api/models/itemSeleccionable";
import { SelectConCreacion } from "../select-con-creacion/select-con-creacion";

interface ProductoForm {
  nombre: string;
  descripcion: string;
  precio: number | null;
  id_categoria: number | null;
  stock: number | null;
}

@Component({
  selector: "app-nuevo-producto",
  imports: [CommonModule, FormsModule, SelectConCreacion],
  templateUrl: "./nuevo-producto.html",
  styleUrl: "./nuevo-producto.css",
})
export class NuevoProducto implements OnInit {
  @Output() cerrar = new EventEmitter<void>();
  @Output() productoGuardado = new EventEmitter<void>();
  private toast = inject(ToastService);
  private errorModal = inject(ErrorModalService);

  guardando = signal(false);
  imagenPreview = signal<string | null>(null);
  imagenArchivo: File | null = null;

  cargandoCategorias = signal(false);  // ← signal, no boolean
  agregandoCategoria = false;
  categorias = signal<Categoria[]>([]);
  idCategoriaSeleccionada = signal<number>(0);

  categoriasComoItems = computed(() =>
    this.categorias().map(c => ({ id: c.id_categoria, nombre: c.nombre }))
  );

  formProducto: ProductoForm = {
    nombre: "",
    descripcion: "",
    precio: null,
    id_categoria: null,
    stock: null,
  };

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.cargandoCategorias.set(true);
    this.productoService.obtenerCategorias().subscribe({
      next: (data) => {
        this.categorias.set(data ?? []);
        this.cargandoCategorias.set(false);
      },
      error: (err) => {
        this.cargandoCategorias.set(false);
        this.errorModal.mostrar(err?.error?.mensaje || "Error al cargar las categorías");
      },
    });
  }

  onCategoriaSeleccionada(item: ItemSeleccionable) {
    this.formProducto.id_categoria = item.id;
  }

  onNuevaCategoria(nombre: string) {
    this.agregandoCategoria = true;
    const idsAntes = this.categorias().map(c => c.id_categoria);

    this.productoService.insertarCategoria(nombre).subscribe({
      next: () => {
        this.toast.mostrar('Categoría agregada correctamente');
        this.productoService.obtenerCategorias().subscribe({
          next: (data) => {
            this.categorias.set(data ?? []);
            this.agregandoCategoria = false;
            const nueva = data.find(c => !idsAntes.includes(c.id_categoria));
            if (nueva) {
              this.idCategoriaSeleccionada.set(nueva.id_categoria);
              this.formProducto.id_categoria = nueva.id_categoria;
            }
          }
        });
      },
      error: (err) => {
        this.agregandoCategoria = false;
        this.errorModal.mostrar(err?.error?.mensaje || 'Error al agregar');
      }
    });
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains("fixed")) {
      this.cerrar.emit();
    }
  }

  onImagenSeleccionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.imagenArchivo = file;
    const reader = new FileReader();
    reader.onload = () => this.imagenPreview.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  quitarImagen(): void {
    this.imagenArchivo = null;
    this.imagenPreview.set(null);
  }

  guardar(): void {
    if (!this.formProducto.nombre.trim()) {
      this.errorModal.mostrar("El nombre es obligatorio");
      return;
    }
    if (!this.formProducto.precio || this.formProducto.precio <= 0) {
      this.errorModal.mostrar("Ingresá un precio válido");
      return;
    }
    if (!this.formProducto.id_categoria) {
      this.errorModal.mostrar("Seleccioná una categoría");
      return;
    }
    if (this.formProducto.stock === null || this.formProducto.stock < 0) {
      this.errorModal.mostrar("Ingresá un stock válido");
      return;
    }
    if (!this.imagenArchivo) {
      this.errorModal.mostrar("Seleccioná una imagen para el producto");
      return;
    }

    this.guardando.set(true);

    const payload: ProductoRequest = {
      nombre: this.formProducto.nombre,
      descripcion: this.formProducto.descripcion,
      precio: this.formProducto.precio,
      id_categoria: this.formProducto.id_categoria,
      stock: this.formProducto.stock,
      imagen_url: "",
    };

    this.productoService.insertarProducto(this.imagenArchivo, payload).subscribe({
      next: () => {
        setTimeout(() => this.toast.mostrar("Producto creado correctamente"));
        this.productoGuardado.emit();
        this.cerrar.emit();
      },
      error: (err) => {
        this.guardando.set(false);
        this.errorModal.mostrar(err?.error?.mensaje || "Error al guardar el producto");
      },
      complete: () => this.guardando.set(false),
    });
  }
}