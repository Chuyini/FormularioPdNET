import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-floating-button',
  imports: [],
  templateUrl: './floating-button.component.html',
  styleUrl: './floating-button.component.css'
})
export class FloatingButtonComponent {
  isAtTop = true;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isAtTop = window.scrollY === 0;
  }

  scroll() {
    if (this.isAtTop) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
