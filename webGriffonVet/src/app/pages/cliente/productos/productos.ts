import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductoService } from '../../../core/services/producto-service';
import { Producto } from '../../../api/models/producto';

@Component({
  selector: 'app-productos',
  imports: [CommonModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos {

  categoriaSeleccionada = signal<string>('ALL');

  constructor(private productoService: ProductoService) {}

  productosResource = rxResource({
    stream: () => this.productoService.obtenerProductos(),
  });

  // 🔹 categorías dinámicas
  categorias = computed(() => {
    const productos = this.productosResource.value() ?? [];
    const cats = new Set(productos.map(p => p.categoria));
    return ['ALL', ...cats];
  });

  // 🔹 filtrado por categoría
  productosFiltrados = computed(() => {
    const productos = this.productosResource.value() ?? [];
    const categoria = this.categoriaSeleccionada();

    if (categoria === 'ALL') return productos;

    return productos.filter(p => p.categoria === categoria);
  });

  seleccionarCategoria(cat: string) {
    this.categoriaSeleccionada.set(cat);
  }
}