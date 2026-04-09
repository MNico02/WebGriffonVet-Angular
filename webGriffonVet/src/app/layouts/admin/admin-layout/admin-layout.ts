import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { ToastComponent } from '../../../components/toast/toast';
import { ErrorModalComponent } from '../../../components/error-modal/error-modal';
@Component({
  selector: 'app-admin-layout',
  imports: [
    RouterOutlet, 
    RouterModule,
    ToastComponent,
  ErrorModalComponent
    ],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {}
