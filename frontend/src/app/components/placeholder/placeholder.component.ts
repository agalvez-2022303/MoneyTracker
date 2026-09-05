import { Component } from '@angular/core';

@Component({
  selector: 'app-placeholder',
  standalone: true,
  template: `
    <div class="env">
      <img src="assets/logo.png" alt="Money Tracker" class="logo" />
      <span class="chip">V2 · EN CONSTRUCCION</span>
      <p>El frontend se está construyendo. Pronto verás la landing y el login.</p>
    </div>
  `,
  styles: [
    `
      .env {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 18px;
        text-align: center;
        padding: 24px;
      }
      .logo { width: 150px; height: auto; margin-bottom: 6px; }
      p { color: var(--muted); max-width: 420px; line-height: 1.6; font-size: 14px; }
    `,
  ],
})
export class PlaceholderComponent {}