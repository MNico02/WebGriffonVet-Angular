import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { Header } from '../../../components/header/header';
import { Footer } from '../../../components/footer/footer';
import { ToastComponent } from '../../../components/toast/toast';
import { ErrorModalComponent } from '../../../components/error-modal/error-modal';
@Component({
  selector: 'app-main',
  imports: [
    RouterOutlet, 
    Header, 
    RouterModule,
    Footer,
    ToastComponent,
    ErrorModalComponent
  ],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {}
