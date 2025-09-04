const logs: string[] = [];

type ConsoleMethod = 'log' | 'warn' | 'error';

(['log', 'warn', 'error'] as ConsoleMethod[]).forEach((tipo) => {
  const original = console[tipo]; // ✅ ahora TypeScript lo acepta
  console[tipo] = function (...args: any[]) {
    logs.push(`[${tipo.toUpperCase()}] ${args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ')}`);
    localStorage.setItem('consoleLogs', JSON.stringify(logs));
    original.apply(console, args);
  };
});

// Ahora sí, arranca la app
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));