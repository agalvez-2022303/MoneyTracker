import { ControlValueAccessor } from '@angular/forms';
import { signal } from '@angular/core';

export abstract class CampoBase implements ControlValueAccessor {
  readonly _valor = signal('');

  protected onChangeV: (v: unknown) => void = () => {};
  protected onTocado: () => void = () => {};

  writeValue(v: unknown): void {
    this._valor.set(v === null || v === undefined ? '' : String(v));
  }

  registerOnChange(fn: (v: unknown) => void): void {
    this.onChangeV = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTocado = fn;
  }

  protected tocar(): void {
    this.onTocado();
  }

  protected emitir(v: unknown): void {
    this._valor.set(v as string);
    this.onChangeV(v);
  }
}