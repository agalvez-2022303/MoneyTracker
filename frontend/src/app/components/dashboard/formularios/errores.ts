import { AbstractControl, FormGroup } from '@angular/forms';

export function mayorQueCero(control: AbstractControl): { montoInvalido: true } | null {
  if (control.value === '' || control.value === null) return null;
  const n = Number(control.value);
  if (!Number.isFinite(n) || n <= 0) return { montoInvalido: true };
  return null;
}

export function noNegativo(control: AbstractControl): { montoNegativo: true } | null {
  if (control.value === '' || control.value === null) return null;
  const n = Number(control.value);
  if (!Number.isFinite(n) || n < 0) return { montoNegativo: true };
  return null;
}

export function errorDe(form: FormGroup, nombre: string): string {
  const c = form.get(nombre);
  if (!c || !c.touched) return '';
  if (c.hasError('required')) return 'Campo obligatorio';
  if (c.hasError('montoInvalido')) return 'Debe ser mayor a 0';
  if (c.hasError('montoNegativo')) return 'No puede ser negativo';
  return '';
}

export function limpiarTexto(valor: string): string {
  return valor.trim();
}

export function aNumeroOpcional(valor: string, porDefecto = 0): number {
  const t = valor.trim();
  if (t === '') return porDefecto;
  const n = Number(t);
  return Number.isFinite(n) ? n : porDefecto;
}