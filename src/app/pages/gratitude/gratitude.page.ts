import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import axios from 'axios';
import { environment } from '../../../environments/environment';
import { AltaService } from '../../services/alta.service';
import { LanguageSwitcherComponent } from '../../components/language-switcher/language-switcher.component';
import { descargarCopiaPdf } from '../../pdf-copia';

/** Si no se sabe a quién se mandó el alta (ej. recargaron la página), la encuesta llega a ventas */
const DESTINO_RESPALDO = ['ventas@elpoderdeinternet.mx'];

@Component({
  selector: 'app-gratitude',
  imports: [FormsModule, RouterLink, TranslocoModule, LanguageSwitcherComponent],
  templateUrl: './gratitude.page.html',
  styleUrl: './gratitude.page.css'
})
export class GratitudePage {
  private transloco = inject(TranslocoService);
  readonly alta = inject(AltaService).obtener();

  readonly caras = [
    { valor: 1, emoji: '😞', texto: 'Muy difícil' },
    { valor: 2, emoji: '🙁', texto: 'Difícil' },
    { valor: 3, emoji: '😐', texto: 'Normal' },
    { valor: 4, emoji: '🙂', texto: 'Fácil' },
    { valor: 5, emoji: '😄', texto: 'Muy fácil' },
  ];
  readonly estrellas = [1, 2, 3, 4, 5];
  readonly escala = Array.from({ length: 11 }, (_, i) => i);

  facilidad: number | null = null;
  atencion: number | null = null;
  estrellaHover = 0;
  recomendacion: number | null = null;
  comentarios = '';

  estado: 'pendiente' | 'enviando' | 'enviada' | 'omitida' = 'pendiente';
  error = '';

  get completa(): boolean {
    return this.facilidad !== null && this.atencion !== null && this.recomendacion !== null;
  }

  /** Color del botón 0-10: rojo para detractores, ámbar neutrales, verde promotores */
  tono(n: number): string {
    return n <= 6 ? 'bajo' : n <= 8 ? 'medio' : 'alto';
  }

  async enviarEncuesta(): Promise<void> {
    if (!this.completa) return;
    this.estado = 'enviando';
    this.error = '';
    try {
      await axios.post(`${environment.apiUrl}/encuesta`, {
        cliente: this.alta?.cliente ?? '',
        vendedor: this.alta?.vendedor ?? '',
        destinatarios: this.alta?.destinatarios?.length ? this.alta.destinatarios : DESTINO_RESPALDO,
        idioma: this.transloco.getActiveLang(),
        respuestas: {
          facilidad: this.facilidad,
          atencion: this.atencion,
          recomendacion: this.recomendacion,
          comentarios: this.comentarios.trim(),
        },
      });
      this.estado = 'enviada';
    } catch {
      this.estado = 'pendiente';
      this.error = 'No se pudo enviar la encuesta. Intente de nuevo.';
    }
  }

  omitir(): void {
    this.estado = 'omitida';
  }

  async descargarCopia(): Promise<void> {
    if (this.alta?.variables) await descargarCopiaPdf(this.alta.variables, this.alta.cliente);
  }
}
