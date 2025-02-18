import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FormComponent } from '../../components/form/form.component';
import { FloatingButtonComponent } from '../../components/floating-button/floating-button.component';

@Component({
  selector: 'app-home',
  imports: [HeaderComponent, FormComponent, FloatingButtonComponent],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css'
})
export class HomePage {


}
