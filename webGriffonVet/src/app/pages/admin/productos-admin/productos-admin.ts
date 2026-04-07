import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { NuevoProducto } from '../../../layouts/admin/nuevo-producto/nuevo-producto';
import { EditarProducto } from '../../../layouts/admin/editar-producto/editar-producto';
import { ProductoService } from '../../../core/services/producto-service';
import { Producto } from '../../../api/models/producto';

@Component({
  selector: 'app-productos-admin',
  imports: [CommonModule, NuevoProducto, EditarProducto],
  templateUrl: './productos-admin.html',
  styleUrl: './productos-admin.css',
})
export class ProductosAdmin {

  mostrarModal = signal(false);
  modalEditarAbierto = signal(false);
  productoSeleccionado = signal<Producto | null>(null);
  searchQuery = signal('');

  constructor(private productoService: ProductoService) {}

  productosResource = rxResource({
    stream: () => this.productoService.obtenerProductos(),
  });

  productosFiltrados = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const productos = this.productosResource.value() ?? [];

    if (!query) return productos;

    return productos.filter(p =>
      p.nombre.toLowerCase().includes(query) ||
      p.descripcion?.toLowerCase().includes(query)
    );
  });

  abrirModal() { this.mostrarModal.set(true); }
  onProductoGuardado() { this.mostrarModal.set(false); this.productosResource.reload(); }

  abrirEditar(p: Producto) { this.productoSeleccionado.set(p); this.modalEditarAbierto.set(true); }
  onProductoEditado() { this.modalEditarAbierto.set(false); this.productosResource.reload(); }

  eliminar(id: number) {
  const confirmar = confirm('¿Seguro que querés eliminar este producto?');

  if (!confirmar) return;

  this.productoService.eliminarProducto(id).subscribe({
    next: () => {
      // refrescar lista
      this.onProductoGuardado(); 
      // o el método que uses para recargar
    },
    error: (err) => {
      console.error('Error al eliminar', err);
      alert('Error al eliminar el producto');
    }
  });
}
}