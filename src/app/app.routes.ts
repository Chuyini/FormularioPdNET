import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home.page';
import { GratitudePage } from './pages/gratitude/gratitude.page';
export const routes: Routes = [
    {
        path: "", component: HomePage
    },
    { path: "gratitude", component: GratitudePage }
];
