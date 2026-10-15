import { Injectable } from '@angular/core';

/** Datos del alta recién enviada que necesita la página de gracias (encuesta y copia en PDF) */
export interface UltimaAlta {
  cliente: string;
  vendedor: string;
  destinatarios: string[];
  /** Secciones del alta tal como se mandaron al backend; solo vive en memoria (trae datos bancarios) */
  variables?: Record<string, any>;
}

const LLAVE = 'altaPdnt.ultima';

@Injectable({ providedIn: 'root' })
export class AltaService {
  private ultima: UltimaAlta | null = null;

  guardar(alta: UltimaAlta): void {
    this.ultima = alta;
    // En sessionStorage solo lo necesario para la encuesta si recargan la página; nunca los datos del alta
    try {
      const { cliente, vendedor, destinatarios } = alta;
      sessionStorage.setItem(LLAVE, JSON.stringify({ cliente, vendedor, destinatarios }));
    } catch {}
  }

  obtener(): UltimaAlta | null {
    if (this.ultima) return this.ultima;
    try {
      return JSON.parse(sessionStorage.getItem(LLAVE) ?? 'null');
    } catch {
      return null;
    }
  }
}
