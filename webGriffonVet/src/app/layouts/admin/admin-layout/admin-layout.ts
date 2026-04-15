import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { ToastComponent } from '../../../components/toast/toast';
import { ErrorModalComponent } from '../../../components/error-modal/error-modal';
import { AuthService } from '../../../core/services/auth'; 

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    ToastComponent,
    ErrorModalComponent
  ],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {

  // 🔹 estado del sidebar
  collapsed = signal(false);

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  // 🔹 toggle correcto con signals
  toggle() {
    this.collapsed.update(v => !v);
  }

  // 🔹 logout
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}