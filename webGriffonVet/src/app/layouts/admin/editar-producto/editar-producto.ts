import {
  Component,
  input,
  output,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ProductoService } from "../../../core/services/producto-service";
import {
  Producto,
  ProductoEditarRequest,
  Categoria,
} from "../../../api/models/producto";
import { ToastService } from "../../../core/services/toast.service";
import { ErrorModalService } from "../../../core/services/error-modal";

@Component({
  selector: "app-editar-producto",
  imports: [CommonModule, FormsModule],
  templateUrl: "./editar-producto.html",
})
export class EditarProducto implements OnInit {
  producto = input.required<Producto>();
  private service = inject(ProductoService);
  private toast = inject(ToastService);
  private errorModal = inject(ErrorModalService);

  cerrar = output<void>();
  productoEditado = output<void>();

  categorias= signal<Categoria[]>([]);
  cargandoCategorias = signal(false);
  nuevaCategoriaNombre = "";
  agregandoCategoria = false;

  guardando = signal(false);

  imagenPreview = signal<string | null>(null);
  imagenArchivo: File | null = null;

  form: ProductoEditarRequest = {
    id_producto: 0,
    nombre: "",
    descripcion: "",
    precio: null,
    id_categoria: 0,
    imagen_url: "",
    stock: null,
  };

  ngOnInit() {
    const p = this.producto();
    
    this.form = {
      id_producto: p.id_producto,
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio: p.precio,
      id_categoria: p.id_categoria,
      imagen_url: p.imagen_url,
      stock: p.stock,
    };
    if (p.imagen_url) {
      this.imagenPreview.set(p.imagen_url);
    }
    
    this.cargarCategorias();
  }

  cargarCategorias() {
    this.cargandoCategorias.set(true);
    this.service.obtenerCategorias().subscribe({
      next: (data) => {
        
        this.categorias.set(data ?? []);
       
        this.form.id_categoria = Number(this.form.id_categoria);
        this.cargandoCategorias.set(false);
      },
      error: () => {
        this.cargandoCategorias.set(false);
        this.errorModal.mostrar("No se pudieron cargar las categorías.");
      },
    });
  }

  agregarCategoria() {
    if (!this.nuevaCategoriaNombre.trim()) return;
    this.agregandoCategoria = true;
    this.service.insertarCategoria(this.nuevaCategoriaNombre.trim()).subscribe({
      next: () => {
        this.nuevaCategoriaNombre = "";
        this.agregandoCategoria = false;
        this.cargarCategorias();
      },
      error: () => {
        this.agregandoCategoria = false;
        //this.error.set('Error al agregar la categoría.');
        this.errorModal.mostrar("Error al agregar la categoría.");
      },
    });
  }

  onImagenSeleccionada(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      //this.error.set('La imagen no puede superar los 5MB.');
      this.errorModal.mostrar("La imagen no puede superar los 5MB.");
      return;
    }
    this.imagenArchivo = file;
    const reader = new FileReader();
    reader.onload = () => this.imagenPreview.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  quitarImagen() {
    this.imagenArchivo = null;
    this.imagenPreview.set(null);
    this.form.imagen_url = "";
  }

  guardar() {
    //this.error.set(null);

    if (!this.form.nombre.trim()) {
      // this.error.set('El nombre es obligatorio.');
      this.errorModal.mostrar("El nombre es obligatorio.");
      return;
    }
    if (this.form.precio === null || this.form.precio < 0) {
      // this.error.set('Ingresá un precio válido.');
      this.errorModal.mostrar("Ingresá un precio válido.");
      return;
    }

    this.guardando.set(true);
    const payload: ProductoEditarRequest = { ...this.form };

    this.service
      .actualizarProducto(payload, this.imagenArchivo ?? undefined)
      .subscribe({
        next: () => {
          this.guardando.set(false);
          this.toast.mostrar("Producto actualizado correctamente");
          this.productoEditado.emit();
          this.cerrar.emit();
        },
        error: (err) => {
          this.guardando.set(false);
          //this.error.set('Ocurrió un error al guardar. Intentá de nuevo.');
          const mensaje = err?.error?.mensaje || "Ocurrió un error al guardar.";
          this.errorModal.mostrar(mensaje);
        },
      });
  }

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains("bg-black\\/40")) {
      this.cerrar.emit();
    }
  }
}
