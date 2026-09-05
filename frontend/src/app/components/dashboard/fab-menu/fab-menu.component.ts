import { Component, output, signal } from '@angular/core';
import { LucideArrowRightLeft, LucidePlus, LucideTarget, LucideWallet } from '@lucide/angular';

@Component({
  selector: 'app-fab-menu',
  standalone: true,
  imports: [LucidePlus, LucideTarget, LucideWallet, LucideArrowRightLeft],
  template: `
    <div class="relative">
      @if (abierto()) {
        <div class="fixed inset-0 z-40" (click)="cerrar()"></div>
        <div
          class="fab-menu__pop absolute bottom-[62px] right-0 z-50 w-60 overflow-hidden rounded-2xl border border-white/5 bg-[#1C1C1F] p-1.5 shadow-2xl shadow-black/60"
          role="menu"
        >
          <p class="px-3 pb-2 pt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9CA3AF]">
            Nuevo
          </p>
          <button
            type="button"
            role="menuitem"
            (click)="elegir('meta')"
            class="flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition-colors hover:bg-white/5"
          >
            <span class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#22E27A]/12 text-[#22E27A]">
              <svg lucideTarget size="16"></svg>
            </span>
            <span>
              <span class="block text-sm font-medium text-[#F5F5F5]">Meta</span>
              <span class="block text-[11px] text-[#9CA3AF]">Objetivo de ahorro</span>
            </span>
          </button>
          <button
            type="button"
            role="menuitem"
            (click)="elegir('cuenta')"
            class="flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition-colors hover:bg-white/5"
          >
            <span class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#22E27A]/12 text-[#22E27A]">
              <svg lucideWallet size="16"></svg>
            </span>
            <span>
              <span class="block text-sm font-medium text-[#F5F5F5]">Cuenta</span>
              <span class="block text-[11px] text-[#9CA3AF]">Billetera o banco</span>
            </span>
          </button>
          <button
            type="button"
            role="menuitem"
            (click)="elegir('transaccion')"
            class="flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition-colors hover:bg-white/5"
          >
            <span class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#22E27A]/12 text-[#22E27A]">
              <svg lucideArrowRightLeft size="16"></svg>
            </span>
            <span>
              <span class="block text-sm font-medium text-[#F5F5F5]">Transacción</span>
              <span class="block text-[11px] text-[#9CA3AF]">Ingreso o egreso</span>
            </span>
          </button>
        </div>
      }
      <button
        type="button"
        (click)="toggle()"
        [attr.aria-expanded]="abierto()"
        [attr.aria-label]="abierto() ? 'Cerrar menú' : 'Crear'"
        class="relative z-50 flex size-14 items-center justify-center rounded-full bg-[#22E27A] text-[#121214] shadow-[0_16px_40px_rgba(34,226,122,0.35)] transition-transform active:scale-95"
      >
        <svg lucidePlus size="26" class="transition-transform duration-300" [class.rotate-45]="abierto()"></svg>
      </button>
    </div>
  `,
  styleUrls: ['./fab-menu.component.css'],
})
export class FabMenuComponent {
  readonly nuevaMeta = output<void>();
  readonly nuevaCuenta = output<void>();
  readonly nuevaTransaccion = output<void>();

  readonly abierto = signal(false);

  toggle(): void {
    this.abierto.set(!this.abierto());
  }

  cerrar(): void {
    this.abierto.set(false);
  }

  elegir(forma: 'meta' | 'cuenta' | 'transaccion'): void {
    this.cerrar();
    if (forma === 'meta') this.nuevaMeta.emit();
    if (forma === 'cuenta') this.nuevaCuenta.emit();
    if (forma === 'transaccion') this.nuevaTransaccion.emit();
  }
}