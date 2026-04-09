import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable , map } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Producto, ProductoEditarRequest, ProductoRequest, Categoria } from '../../api/models/producto';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ──────────────── CATEGORÍAS ────────────────

  obtenerCategorias(): Observable<Categoria[]> {
  return this.http.get<any>(`${this.apiUrl}/ObtenerCategorias`).pipe(
    map(response => {
      const data = typeof response === 'string' ? JSON.parse(response) : response;
      return Array.isArray(data) ? data : (data.categorias ?? []);
    })
  );
}

  insertarCategoria(nombre: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/InsertarCategoria`,{nombre});
  }

  // ──────────────── PRODUCTOS ────────────────

  obtenerProductos(): Observable<Producto[]> {
  return this.http.get<any>(`${this.apiUrl}/obtenerProductos`).pipe(
    map(response => {
      const data = typeof response === 'string' ? JSON.parse(response) : response;
      return Array.isArray(data) ? data : (data.productos ?? []);
    })
  );
}

  insertarProducto(imagen: File, producto: ProductoRequest): Observable<any> {
    const formData = new FormData();
    formData.append('imagen', imagen);
    formData.append('producto', JSON.stringify(producto));
    return this.http.post(`${this.apiUrl}/insertarProductos`, formData);
  }

  actualizarProducto(producto: ProductoEditarRequest, imagen?: File): Observable<any> {
    const formData = new FormData();
    if (imagen) {
      formData.append('imagen', imagen);
    }
    formData.append('producto', JSON.stringify(producto));
    return this.http.put(`${this.apiUrl}/actualizarProductos`, formData);
  }

  eliminarProducto(id_producto: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/EliminarProducto`, { body: {id_producto} });
  }
}
