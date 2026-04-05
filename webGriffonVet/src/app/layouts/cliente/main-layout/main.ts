import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { Header } from '../../../components/header/header';
import { Footer } from '../../../components/footer/footer';

@Component({
  selector: 'app-main',
  imports: [
    RouterOutlet, 
    Header, 
    RouterModule,
    Footer
  ],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {}
