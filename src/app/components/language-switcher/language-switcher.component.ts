import { Component, inject } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { IDIOMAS, cambiarIdioma } from '../../idioma';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.css',
})
export class LanguageSwitcherComponent {
  private transloco = inject(TranslocoService);

  readonly idiomas = IDIOMAS;

  get activo(): string {
    return this.transloco.getActiveLang();
  }

  elegir(codigo: string): void {
    cambiarIdioma(this.transloco, codigo);
  }
}
