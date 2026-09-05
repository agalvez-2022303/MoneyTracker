import { Component, input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { LucideChevronDown } from '@lucide/angular';
import { CampoBase } from './campo-base';

@Component({
  selector: 'app-ui-select',
  standalone: true,
  imports: [LucideChevronDown],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: UiSelectComponent, multi: true }],
  template: `
    <label class="block">
      <span class="mb-1.5 flex items-baseline justify-between gap-2 text-[11px] font-medium uppercase tracking-[0.08em] text-[#9CA3AF]">
        <span>{{ etiqueta() }}</span>
        @if (opcional()) {
          <span class="normal-case tracking-normal text-[#71717A]">(opcional)</span>
        }
      </span>
      <span class="relative block">
        <select
          [value]="_valor()"
          (change)="cambio($event)"
          (blur)="tocar()"
          class="campo-control campo-control--con-flecha appearance-none"
          [class.campo-control--invalido]="invalido()"
        >
          @if (placeholder()) {
            <option value="" disabled hidden></option>
          }
          <ng-content></ng-content>
        </select>
        <svg
          lucideChevronDown
          size="16"
          class="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
        ></svg>
      </span>
      @if (error()) {
        <span class="mt-1.5 block text-xs leading-tight text-[#EF4444]">{{ error() }}</span>
      }
    </label>
  `,
})
export class UiSelectComponent extends CampoBase {
  readonly etiqueta = input('');
  readonly opcional = input(false);
  readonly invalido = input(false);
  readonly error = input('');
  readonly placeholder = input('');

  cambio(event: Event): void {
    this.emitir((event.target as HTMLSelectElement).value);
  }
}