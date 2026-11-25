import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home.page';
import { GratitudePage } from './pages/gratitude/gratitude.page';
import { ES_RESIDENCIAL } from './components/form/form.component';

export const routes: Routes = [
  { path: '', component: HomePage },
  // "/residencial" exacto o su enlace especial; cualquier otra variante cae en '**' y va al inicio
  { path: 'residencial', component: HomePage, canMatch: [() => ES_RESIDENCIAL] },
  { path: 'gratitude', component: GratitudePage },
  { path: '**', redirectTo: '' },
];
