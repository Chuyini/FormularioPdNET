const logs: string[] = [];
const MAX_LOGS = 500;
const MAX_ENTRY_LENGTH = 1000;

type ConsoleMethod = 'log' | 'warn' | 'error';

(['log', 'warn', 'error'] as ConsoleMethod[]).forEach((tipo) => {
  const original = console[tipo];

  console[tipo] = function (...args: any[]) {
    const formatted = args.map(a => {
      try {
        const str = typeof a === 'object' ? JSON.stringify(a) : String(a);
        return str.length > MAX_ENTRY_LENGTH ? str.slice(0, MAX_ENTRY_LENGTH) + '... [truncado]' : str;
      } catch {
        return '[Error al serializar]';
      }
    }).join(' ');

    logs.push(`[${tipo.toUpperCase()}] ${formatted}`);

    // Mantener solo los últimos MAX_LOGS
    if (logs.length > MAX_LOGS) logs.shift();

    try {
      localStorage.setItem('consoleLogs', JSON.stringify(logs));
    } catch (e) {
      console.warn('LocalStorage lleno. Se omite guardado de logs.');
    }

    original.apply(console, args);
  };
});

// Ahora sí, arranca la app
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));