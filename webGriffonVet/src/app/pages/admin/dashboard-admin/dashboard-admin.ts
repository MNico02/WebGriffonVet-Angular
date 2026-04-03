import { Component } from '@angular/core';
import { ClientesAdmin } from "../clientes-admin/clientes-admin";
import { ActivatedRoute, Router, RouterModule  } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-dashboard-admin',
  imports: [ClientesAdmin],
  templateUrl: './dashboard-admin.html',
  styleUrl: './dashboard-admin.css',
})
export class DashboardAdmin {

  constructor(
    private authService: AuthService,
    private router: Router,
     private route: ActivatedRoute
  ) {}
  


}
