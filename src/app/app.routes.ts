import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home.page';
import { GratitudePage } from './pages/gratitude/gratitude.page';
import { LoadPage } from './pages/load/load.page';
import { ErrorPage } from './pages/error/error.page';
export const routes: Routes = [
    {
        path: "", component: HomePage
    },
    { path: "gratitude", component: GratitudePage },
    { path: "load", component: LoadPage },
    {
        path: "error", component: ErrorPage
    }
];
