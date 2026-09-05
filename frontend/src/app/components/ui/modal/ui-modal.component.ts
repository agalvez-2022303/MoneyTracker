import { Component, DestroyRef, inject, input, output } from '@angular/core';
import { LucideX } from '@lucide/angular';

@Component({
  selector: 'app-ui-modal',
  standalone: true,
  imports: [LucideX],
  template: `
    <div class="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-4" (mousedown)="cerrar()">
      <div class="ui-modal__fondo absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      <div
        class="ui-modal__tarjeta relative flex max-h-[94dvh] w-full shrink-0 flex-col overflow-hidden rounded-t-2xl border border-white/5 bg-[#1C1C1F] shadow-2xl shadow-black/60 sm:max-h-[90dvh] sm:rounded-2xl"
        [class.sm:max-w-sm]="ancho() === 'sm'"
        [class.sm:max-w-md]="ancho() === 'md'"
        [class.sm:max-w-lg]="ancho() === 'lg'"
        role="dialog"
        aria-modal="true"
        (mousedown)="$event.stopPropagation()"
      >
        <header class="flex items-start justify-between gap-4 border-b border-white/5 px-5 py-4 sm:px-6">
          <div class="min-w-0">
            <h2 class="text-base font-bold text-[#F5F5F5]">{{ titulo() }}</h2>
            @if (subtitulo()) {
              <p class="mt-0.5 text-[13px] text-[#9CA3AF]">{{ subtitulo() }}</p>
            }
          </div>
          <button
            type="button"
            (click)="cerrar()"
            aria-label="Cerrar"
            class="flex size-8 shrink-0 items-center justify-center rounded-full text-[#9CA3AF] transition-colors hover:bg-white/5 hover:text-[#F5F5F5]"
          >
            <svg lucideX size="18"></svg>
          </button>
        </header>

        <div class="overflow-y-auto">
          <ng-content></ng-content>
        </div>

        <ng-content select="[ui-footer]"></ng-content>
      </div>
    </div>
  `,
  styleUrls: ['./ui-modal.component.css'],
})
export class UiModalComponent {
  readonly titulo = input('');
  readonly subtitulo = input('');
  readonly ancho = input<'sm' | 'md' | 'lg'>('md');
  readonly cerrado = output<void>();

  private readonly destroy = inject(DestroyRef);

  constructor() {
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') this.cerrar();
    };
    document.addEventListener('keydown', esc);
    this.destroy.onDestroy(() => document.removeEventListener('keydown', esc));
  }

  cerrar(): void {
    this.cerrado.emit();
  }
}