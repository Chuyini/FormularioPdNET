import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-error',
  imports: [NgIf, NgFor],
  templateUrl: './error.page.html',
  styleUrls: ['./error.page.css']
})


export class ErrorPage implements OnInit {
  consoleLogs: string[] = [];

  ngOnInit(): void {
    const logs = localStorage.getItem('consoleLogs');
    if (logs) {
      try {
        this.consoleLogs = JSON.parse(logs);
      } catch (e) {
        this.consoleLogs = ['[ERROR] No se pudo parsear el log de consola'];
      }
    }
  }

  limpiar(): void {
    localStorage.removeItem('consoleLogs');
    this.consoleLogs = [];
  }
}

