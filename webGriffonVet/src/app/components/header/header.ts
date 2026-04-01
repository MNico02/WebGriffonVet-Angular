import { Component, ViewEncapsulation } from '@angular/core'; 
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterModule, CommonModule],
  templateUrl: './header.html',
  standalone: true,
  encapsulation: ViewEncapsulation.None
})
export class Header {

}



