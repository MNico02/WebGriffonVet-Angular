import { Component, computed } from '@angular/core';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { HomeService } from '../../../core/services/home-service';
import { NoticiasHome } from '../../../api/models/home';

@Component({
  selector: 'app-home',
  imports: [RouterLink, DatePipe, UpperCasePipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  constructor(private homeService: HomeService) {}

  homeResource = rxResource({
    stream: () => this.homeService.obtenerInfoHome(),
  });

  servicios = computed(() => this.homeResource.value()?.servicios ?? []);
  noticias = computed(() => this.homeResource.value()?.noticias ?? []);
  noticiaDestacada = computed(() => this.noticias()[0] ?? null);
  noticiasLaterales = computed(() => this.noticias().slice(1, 4));
}