import { Component, signal } from '@angular/core';
import { ClientesAdmin } from "../clientes-admin/clientes-admin";
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-dashboard-admin',
  imports: [RouterOutlet, 
    RouterModule],
  templateUrl: './dashboard-admin.html',
  styleUrl: './dashboard-admin.css',
})
export class DashboardAdmin {

  constructor(
    private authService: AuthService,
    private router: Router,
     private route: ActivatedRoute
  ) {}
  collapsed = signal(false);
  toggle() { this.collapsed.update(v => !v); }


}
