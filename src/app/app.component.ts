import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomePage } from './pages/home/home.page';
import { GratitudePage } from './pages/gratitude/gratitude.page';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'Alta de clientes'; 
}
