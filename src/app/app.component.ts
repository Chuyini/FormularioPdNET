import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { cambiarIdioma, idiomaInicial } from './idioma';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor() {
    // Abre en el último idioma elegido (o el del navegador)
    cambiarIdioma(inject(TranslocoService), idiomaInicial());
  }
}
