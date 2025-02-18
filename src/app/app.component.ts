import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomePage } from './pages/home/home.page';

@Component({
  selector: 'app-root',
  imports: [HomePage],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'FormPdnt';
}
