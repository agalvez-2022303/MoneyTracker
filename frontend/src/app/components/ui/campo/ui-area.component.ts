import { Component, input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CampoBase } from './campo-base';

@Component({
  selector: 'app-ui-area',
  standalone: true,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: UiAreaComponent, multi: true }],
  template: `
    <label class="block">
      <span class="mb-1.5 flex items-baseline justify-between gap-2 text-[11px] font-medium uppercase tracking-[0.08em] text-[#9CA3AF]">
        <span>{{ etiqueta() }}</span>
        @if (opcional()) {
          <span class="normal-case tracking-normal text-[#71717A]">(opcional)</span>
        }
      </span>
      <textarea
        [value]="_valor()"
        [placeholder]="placeholder()"
        [rows]="filas()"
        (input)="cambio($event)"
        (blur)="tocar()"
        class="campo-control resize-none"
        [class.campo-control--invalido]="invalido()"
      ></textarea>
      @if (error()) {
        <span class="mt-1.5 block text-xs leading-tight text-[#EF4444]">{{ error() }}</span>
      }
    </label>
  `,
})
export class UiAreaComponent extends CampoBase {
  readonly etiqueta = input('');
  readonly opcional = input(false);
  readonly invalido = input(false);
  readonly error = input('');
  readonly placeholder = input('');
  readonly filas = input(3);

  cambio(event: Event): void {
    this.emitir((event.target as HTMLTextAreaElement).value);
  }
}