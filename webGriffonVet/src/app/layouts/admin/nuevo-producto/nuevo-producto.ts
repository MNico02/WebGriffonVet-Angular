import {
  Component,
  EventEmitter,
  inject,
  OnInit,
  Output,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ProductoService } from "../../../core/services/producto-service";
import { Categoria, ProductoRequest } from "../../../api/models/producto";
import { ToastService } from "../../../core/services/toast.service";
import { ErrorModalService } from "../../../core/services/error-modal";
import { ChangeDetectorRef } from '@angular/core';
interface ProductoForm {
  nombre: string;
  descripcion: string;
  precio: number | null;
  id_categoria: number | null;
  stock: number | null;
}

@Component({
  selector: "app-nuevo-producto",
  imports: [CommonModule, FormsModule],
  templateUrl: "./nuevo-producto.html",
  styleUrl: "./nuevo-producto.css",
})
export class NuevoProducto implements OnInit {
  @Output() cerrar = new EventEmitter<void>();
  @Output() productoGuardado = new EventEmitter<void>();
  private toast = inject(ToastService);
  private errorModal = inject(ErrorModalService);
  private cdr = inject(ChangeDetectorRef);
  guardando = signal(false);

  imagenPreview = signal<string | null>(null);
  imagenArchivo: File | null = null;

  cargandoCategorias = false;
  agregandoCategoria = false;
  nuevaCategoriaNombre = "";
  categorias: Categoria[] = [];
mostrarNuevaCategoria = false;
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
    this.cargandoCategorias = true;
    this.productoService.obtenerCategorias().subscribe({
      next: (cats) => {
        this.categorias = cats;
        this.cargandoCategorias = false;
         this.cdr.detectChanges();
      },
      error: (err) => {
        this.cargandoCategorias = false;

        const mensaje = err?.error?.mensaje || "Error al cargar las categorías";
        this.errorModal.mostrar(mensaje);
         this.cdr.detectChanges();
      },
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

  agregarCategoria(): void {
  const nombre = this.nuevaCategoriaNombre.trim();
  if (!nombre) return;

  this.agregandoCategoria = true;

  this.productoService.insertarCategoria(nombre).subscribe({
    next: () => {
      this.nuevaCategoriaNombre = '';
      this.agregandoCategoria = false;

      this.mostrarNuevaCategoria = false;

      this.cargarCategorias();

      setTimeout(() => {
        if (!this.categorias.length) return;

        const ultima = this.categorias.reduce((max, c) =>
          c.id_categoria > max.id_categoria ? c : max
        );

        this.formProducto.id_categoria = ultima.id_categoria;
      }, 300);

      this.toast.mostrar("Categoría agregada correctamente");
    },
    error: (err) => {
      this.agregandoCategoria = false;

      const mensaje = err?.error?.mensaje || "Error al agregar la categoría";
      this.errorModal.mostrar(mensaje);
    },
  });
}

  guardar(): void {
    // 🔒 VALIDACIONES
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

    this.productoService
      .insertarProducto(this.imagenArchivo, payload)
      .subscribe({
        next: () => {
          setTimeout(() => {
    this.toast.mostrar("Producto creado correctamente");
  });

          this.productoGuardado.emit();
          this.cerrar.emit();
        },
        error: (err) => {
          this.guardando.set(false);

          const mensaje = err?.error?.mensaje || "Error al guardar el producto";
          this.errorModal.mostrar(mensaje);
        },
        complete: () => {
          this.guardando.set(false);
        },
      });
  }
}
