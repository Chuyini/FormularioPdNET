import { TranslocoService } from '@ngneat/transloco';

export const IDIOMAS = [
  { codigo: 'es', nombre: 'Español', corto: 'ES' },
  { codigo: 'en', nombre: 'English', corto: 'EN' },
  { codigo: 'zh', nombre: '中文', corto: '中' },
  { codigo: 'ko', nombre: '한국어', corto: '한' },
];

const LLAVE = 'altaPdnt.idioma';

/** Cambia el idioma, lo recuerda para la próxima visita y actualiza <html lang> */
export function cambiarIdioma(transloco: TranslocoService, codigo: string): void {
  if (!IDIOMAS.some((i) => i.codigo === codigo)) return;
  transloco.setActiveLang(codigo);
  document.documentElement.lang = codigo;
  try {
    localStorage.setItem(LLAVE, codigo);
  } catch {}
}

/** Idioma guardado o, si no hay, el del navegador cuando es uno de los disponibles */
export function idiomaInicial(): string {
  try {
    const guardado = localStorage.getItem(LLAVE);
    if (guardado && IDIOMAS.some((i) => i.codigo === guardado)) return guardado;
  } catch {}
  const navegador = (navigator.language || 'es').slice(0, 2);
  return IDIOMAS.some((i) => i.codigo === navegador) ? navegador : 'es';
}
