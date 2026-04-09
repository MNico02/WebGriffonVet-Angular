export interface ApiResponse<T> {
  success: number;
  mensaje: string;
  data: T;
}