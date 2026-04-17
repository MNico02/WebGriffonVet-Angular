import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { NuevoProducto } from '../../../layouts/admin/nuevo-producto/nuevo-producto';
import { EditarProducto } from '../../../layouts/admin/editar-producto/editar-producto';
import { ProductoService } from '../../../core/services/producto-service';
import { Producto } from '../../../api/models/producto';
import { ConfirmarEliminarModal } from "../../../components/confirmar-eliminar-modal/confirmar-eliminar-modal";

@Component({
  selector: 'app-productos-admin',
  imports: [CommonModule, NuevoProducto, EditarProducto, ConfirmarEliminarModal],
  templateUrl: './productos-admin.html',
  styleUrl: './productos-admin.css',
})
export class ProductosAdmin {

  // 🧩 MODALES
  mostrarModal = signal(false);
  modalEditarAbierto = signal(false);
  modalEliminarProducto = signal(false);

  // 🧩 DATA
  productoSeleccionado = signal<Producto | null>(null);
  productoAEliminar = signal<Producto | null>(null);

  // 🔎 BUSCADOR
  searchQuery = signal('');

    mensajeEliminar = computed(() =>
  `¿Seguro que querés eliminar el producto "${this.productoAEliminar()?.nombre}"?`
);

  constructor(private productoService: ProductoService) {}

  // 📦 RESOURCE
  productosResource = rxResource({
    stream: () => this.productoService.obtenerProductos(),
  });

  // 🔎 FILTRO
  productosFiltrados = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const productos = this.productosResource.value() ?? [];

    if (!query) return productos;

    return productos.filter(p =>
      p.nombre.toLowerCase().includes(query) ||
      p.descripcion?.toLowerCase().includes(query)
    );
  });

  // ➕ NUEVO PRODUCTO
  abrirModal() {
    this.mostrarModal.set(true);
  }

  onProductoGuardado() {
    this.mostrarModal.set(false);
    this.productosResource.reload();
  }

  // ✏️ EDITAR
  abrirEditar(p: Producto) {
    this.productoSeleccionado.set(p);
    this.modalEditarAbierto.set(true);
  }

  onProductoEditado() {
    this.modalEditarAbierto.set(false);
    this.productosResource.reload();
  }

  // 🗑️ ABRIR MODAL ELIMINAR
  abrirEliminar(producto: Producto) {
    this.productoAEliminar.set(producto);
    this.modalEliminarProducto.set(true);
  }

  // ❌ CANCELAR
  cancelarEliminarProducto() {
    this.modalEliminarProducto.set(false);
    this.productoAEliminar.set(null);
  }

  // ✅ CONFIRMAR ELIMINACIÓN
  eliminarProductoConfirmado() {
    const producto = this.productoAEliminar();
    if (!producto) return;

    this.productoService.eliminarProducto(producto.id_producto).subscribe({
      next: () => {
        this.modalEliminarProducto.set(false);
        this.productoAEliminar.set(null);
        this.productosResource.reload();
      },
      error: (err) => {
        console.error('Error al eliminar', err);
        alert('Error al eliminar el producto');
      }
    });
  }
}