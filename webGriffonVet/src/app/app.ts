import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderIcon } from './layouts/loader-icon/loader-icon';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoaderIcon],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('webGriffonVet');
}
