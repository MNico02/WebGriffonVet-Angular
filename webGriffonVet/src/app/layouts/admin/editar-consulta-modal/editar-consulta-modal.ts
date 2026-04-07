import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HistorialClinicoService } from '../../../core/services/historial-clinico-service';

@Component({
  selector: 'app-editar-consulta-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-consulta-modal.html'
})
export class EditarConsultaModal {

  @Input() consulta: any;
  @Output() cerrar = new EventEmitter();
  @Output() consultaActualizada = new EventEmitter();

  form: any = {};

  nuevoEstudio = {
    tipo_estudio: '',
    observaciones: ''
  };

  archivos: File[] = [];
  archivoSeleccionadoNombre = '';

  constructor(private historialService: HistorialClinicoService) {}

  ngOnInit() {
    this.form = JSON.parse(JSON.stringify(this.consulta));

    if (!this.form.estudios) {
      this.form.estudios = [];
    }
  }

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.cerrar.emit();
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.archivos.push(file);
      this.archivoSeleccionadoNombre = file.name;
    }
  }

  agregarEstudio() {
    if (!this.nuevoEstudio.tipo_estudio) return;

    this.form.estudios.push({
      tipo_estudio: this.nuevoEstudio.tipo_estudio,
      observaciones: this.nuevoEstudio.observaciones,
      resultado: ''
    });

    this.nuevoEstudio = { tipo_estudio: '', observaciones: '' };
    this.archivoSeleccionadoNombre = '';
  }

  guardar() {
    const formData = new FormData();

    formData.append('consulta', JSON.stringify(this.form));

    this.archivos.forEach(f => {
      formData.append('archivos', f);
    });

    this.historialService.editarConsulta(formData)
      .subscribe(() => {
        this.consultaActualizada.emit();
        this.cerrar.emit();
      });
  }
  eliminarEstudio(index: number) {
  this.form.estudios.splice(index, 1);
}
}