import { Component, input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CampoBase } from './campo-base';

@Component({
  selector: 'app-ui-input',
  standalone: true,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: UiInputComponent, multi: true }],
  template: `
    <label class="block">
      <span class="mb-1.5 flex items-baseline justify-between gap-2 text-[11px] font-medium uppercase tracking-[0.08em] text-[#9CA3AF]">
        <span>{{ etiqueta() }}</span>
        @if (opcional()) {
          <span class="normal-case tracking-normal text-[#71717A]">(opcional)</span>
        }
      </span>
      <span class="relative block">
        @if (prefijo()) {
          <span class="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-sm font-semibold text-[#9CA3AF]">
            {{ prefijo() }}
          </span>
        }
        <input
          [type]="tipo()"
          [value]="_valor()"
          [id]="id()"
          [placeholder]="placeholder()"
          [attr.min]="minimo()"
          [attr.max]="maximo()"
          [attr.step]="paso()"
          [autocomplete]="autocompletar()"
          (input)="cambio($event)"
          (blur)="tocar()"
          class="campo-control"
          [class.campo-control--invalido]="invalido()"
          [class.campo-control--con-prefijo]="!!prefijo()"
        />
      </span>
      @if (error()) {
        <span class="mt-1.5 block text-xs leading-tight text-[#EF4444]">{{ error() }}</span>
      }
    </label>
  `,
})
export class UiInputComponent extends CampoBase {
  readonly etiqueta = input('');
  readonly id = input('');
  readonly tipo = input('text');
  readonly placeholder = input('');
  readonly prefijo = input('');
  readonly opcional = input(false);
  readonly invalido = input(false);
  readonly error = input('');
  readonly minimo = input<string | undefined>(undefined);
  readonly maximo = input<string | undefined>(undefined);
  readonly paso = input<string | undefined>(undefined);
  readonly autocompletar = input('off');

  cambio(event: Event): void {
    this.emitir((event.target as HTMLInputElement).value);
  }
}