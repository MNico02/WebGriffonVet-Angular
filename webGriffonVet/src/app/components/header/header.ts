import { Component, ViewEncapsulation, inject } from '@angular/core'; 
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '../../core/services/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [RouterModule, CommonModule],
  templateUrl: './header.html',
  standalone: true,
  encapsulation: ViewEncapsulation.None
})
export class Header {
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoggedIn$: Observable<boolean> = this.authService.isLoggedIn$();
  private rol = this.authService.getRol();
  isAdmin():boolean{

    if(this.rol === 'ADMIN')
      return true;

    return false;
      
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}



