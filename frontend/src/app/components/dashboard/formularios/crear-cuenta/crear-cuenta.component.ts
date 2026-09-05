import { Component, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import type { LucideIcon } from '@lucide/angular';
import {
  LucideBanknote,
  LucideBitcoin,
  LucideCircleEllipsis,
  LucideCreditCard,
  LucideDynamicIcon,
} from '@lucide/angular';
import { UiModalComponent } from '../../../ui/modal/ui-modal.component';
import { UiInputComponent } from '../../../ui/campo/ui-input.component';
import { UiAreaComponent } from '../../../ui/campo/ui-area.component';
import { CuentasService, type TipoCuenta } from '../../../../services/cuentas.service';
import { aNumeroOpcional, errorDe, limpiarTexto, noNegativo } from '../errores';

interface OpcionTipo {
  valor: TipoCuenta;
  texto: string;
  icono: LucideIcon;
}

@Component({
  selector: 'app-crear-cuenta',
  standalone: true,
  imports: [ReactiveFormsModule, UiModalComponent, UiInputComponent, UiAreaComponent, LucideDynamicIcon],
  templateUrl: './crear-cuenta.component.html',
})
export class CrearCuentaComponent {
  private readonly fb = inject(FormBuilder);
  private readonly cuentas = inject(CuentasService);

  readonly creada = output<void>();
  readonly cerrado = output<void>();

  readonly formulario = this.fb.nonNullable.group({
    nombre: ['', [Validators.required]],
    tipo: ['efectivo' as TipoCuenta],
    descripcion: [''],
    montoFijo: ['', [noNegativo]],
    operacion: ['deposito' as 'deposito' | 'resta'],
  });

  readonly enviando = signal(false);
  readonly errorGlobal = signal('');

  readonly tipos: OpcionTipo[] = [
    { valor: 'efectivo', texto: 'Efectivo', icono: LucideBanknote },
    { valor: 'tarjeta', texto: 'Tarjeta', icono: LucideCreditCard },
    { valor: 'cripto', texto: 'Cripto', icono: LucideBitcoin },
    { valor: 'otro', texto: 'Otro', icono: LucideCircleEllipsis },
  ];

  readonly operaciones: { valor: 'deposito' | 'resta'; texto: string }[] = [
    { valor: 'deposito', texto: 'Depósito' },
    { valor: 'resta', texto: 'Resta' },
  ];

  err(nombre: string): string {
    return errorDe(this.formulario, nombre);
  }

  setTipo(valor: TipoCuenta): void {
    this.formulario.controls.tipo.setValue(valor);
    this.formulario.controls.tipo.markAsTouched();
  }

  setOperacion(valor: 'deposito' | 'resta'): void {
    this.formulario.controls.operacion.setValue(valor);
  }

  cerrar(): void {
    if (!this.enviando()) this.cerrado.emit();
  }

  enviar(): void {
    this.formulario.markAllAsTouched();
    if (this.formulario.invalid) return;
    this.enviando.set(true);
    this.errorGlobal.set('');

    const v = this.formulario.getRawValue();
    const montoFijo = aNumeroOpcional(v.montoFijo);
    const montoInicial = v.operacion === 'resta' ? -montoFijo : montoFijo;

    this.cuentas
      .crear({
        nombre: v.nombre.trim(),
        tipo: v.tipo,
        descripcion: limpiarTexto(v.descripcion),
        monto_inicial: montoInicial,
      })
      .subscribe({
        next: () => {
          this.enviando.set(false);
          this.creada.emit();
        },
        error: () => {
          this.enviando.set(false);
          this.errorGlobal.set('No se pudo crear la cuenta. Inténtelo de nuevo.');
        },
      });
  }
}