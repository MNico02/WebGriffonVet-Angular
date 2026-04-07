import { Component, EventEmitter, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../../../core/services/producto-service';
import { Categoria, ProductoRequest } from '../../../api/models/producto';

interface ProductoForm {
  nombre: string;
  descripcion: string;
  precio: number | null;
  id_categoria: number | null;
  stock: number | null;
}

@Component({
  selector: 'app-nuevo-producto',
  imports: [CommonModule, FormsModule],
  templateUrl: './nuevo-producto.html',
  styleUrl: './nuevo-producto.css',
})
export class NuevoProducto implements OnInit {
  @Output() cerrar = new EventEmitter<void>();
  @Output() productoGuardado = new EventEmitter<void>();

  guardando = signal(false);
  error = signal<string | null>(null);
  imagenPreview = signal<string | null>(null);
  imagenArchivo: File | null = null;

  cargandoCategorias = false;
  agregandoCategoria = false;
  nuevaCategoriaNombre = '';
  categorias: Categoria[] = [];

  formProducto: ProductoForm = {
    nombre: '',
    descripcion: '',
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
      },
      error: () => {
        this.error.set('Error al cargar las categorías.');
        this.cargandoCategorias = false;
      },
    });
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('fixed')) {
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
        this.cargarCategorias();
        this.nuevaCategoriaNombre = '';
        this.agregandoCategoria = false;
      },
      error: () => {
        this.error.set('Error al agregar la categoría.');
        this.agregandoCategoria = false;
      },
    });
  }

  guardar(): void {
    this.error.set(null);

    if (!this.formProducto.nombre.trim()) {
      this.error.set('El nombre es obligatorio.');
      return;
    }
    if (!this.formProducto.precio || this.formProducto.precio <= 0) {
      this.error.set('Ingresá un precio válido.');
      return;
    }
    if (!this.formProducto.id_categoria) {
      this.error.set('Seleccioná una categoría.');
      return;
    }
    if (this.formProducto.stock === null || this.formProducto.stock < 0) {
      this.error.set('Ingresá un stock válido.');
      return;
    }
    if (!this.imagenArchivo) {
      this.error.set('Seleccioná una imagen para el producto.');
      return;
    }

    this.guardando.set(true);

    const payload: ProductoRequest = {
      nombre: this.formProducto.nombre,
      descripcion: this.formProducto.descripcion,
      precio: this.formProducto.precio,
      id_categoria: this.formProducto.id_categoria,
      stock: this.formProducto.stock,
      imagen_url: '',
    };

    this.productoService.insertarProducto(this.imagenArchivo, payload).subscribe({
      next: () => {
        this.productoGuardado.emit();
        this.cerrar.emit();
      },
      error: () => {
        this.error.set('Error al guardar el producto. Intentá de nuevo.');
        this.guardando.set(false);
      },
      complete: () => {
        this.guardando.set(false);
      },
    });
  }
}