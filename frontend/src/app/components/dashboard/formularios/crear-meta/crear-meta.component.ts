import { Component, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import type { LucideIcon } from '@lucide/angular';
import {
  LucideCar,
  LucideCpu,
  LucideDynamicIcon,
  LucideFlag,
  LucideGamepad2,
  LucideGraduationCap,
  LucideHeartPulse,
  LucideHouse,
  LucideLandmark,
  LucidePlane,
  LucideShoppingCart,
} from '@lucide/angular';
import { UiModalComponent } from '../../../ui/modal/ui-modal.component';
import { UiInputComponent } from '../../../ui/campo/ui-input.component';
import { UiAreaComponent } from '../../../ui/campo/ui-area.component';
import { MetasService, type PrioridadMeta } from '../../../../services/metas.service';
import { aNumeroOpcional, errorDe, limpiarTexto, mayorQueCero, noNegativo } from '../errores';

interface OpcionIcono {
  clave: string;
  nombre: string;
  icono: LucideIcon;
}

@Component({
  selector: 'app-crear-meta',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    UiModalComponent,
    UiInputComponent,
    UiAreaComponent,
    LucideDynamicIcon,
  ],
  templateUrl: './crear-meta.component.html',
})
export class CrearMetaComponent {
  private readonly fb = inject(FormBuilder);
  private readonly metas = inject(MetasService);

  readonly creada = output<void>();
  readonly cerrado = output<void>();

  readonly formulario = this.fb.nonNullable.group({
    nombre: ['', [Validators.required]],
    cantidad: ['', [Validators.required, mayorQueCero]],
    prioridad: ['media' as PrioridadMeta],
    descripcion: [''],
    icono: ['', [Validators.required]],
    fechaLimite: ['', [Validators.required]],
    montoInicial: ['', [noNegativo]],
  });

  readonly enviando = signal(false);
  readonly errorGlobal = signal('');

  readonly prioridades: { valor: PrioridadMeta; texto: string; clase: string }[] = [
    { valor: 'alta', texto: 'Alta', clase: 'border-[#EF4444]/70 bg-[#EF4444]/15 text-[#EF4444]' },
    { valor: 'media', texto: 'Media', clase: 'border-[#F59E0B]/70 bg-[#F59E0B]/15 text-[#F59E0B]' },
    { valor: 'baja', texto: 'Baja', clase: 'border-[#22E27A]/70 bg-[#22E27A]/15 text-[#22E27A]' },
  ];

  readonly iconos: OpcionIcono[] = [
    { clave: 'casa', nombre: 'Casa', icono: LucideHouse },
    { clave: 'viaje', nombre: 'Viaje', icono: LucidePlane },
    { clave: 'auto', nombre: 'Auto', icono: LucideCar },
    { clave: 'tecnologia', nombre: 'Tecnología', icono: LucideCpu },
    { clave: 'educacion', nombre: 'Educación', icono: LucideGraduationCap },
    { clave: 'salud', nombre: 'Salud', icono: LucideHeartPulse },
    { clave: 'compras', nombre: 'Compras', icono: LucideShoppingCart },
    { clave: 'entretenimiento', nombre: 'Entretenimiento', icono: LucideGamepad2 },
    { clave: 'inversion', nombre: 'Inversión', icono: LucideLandmark },
    { clave: 'otro', nombre: 'Otro', icono: LucideFlag },
  ];

  err(nombre: string): string {
    return errorDe(this.formulario, nombre);
  }

  setPrioridad(valor: PrioridadMeta): void {
    this.formulario.controls.prioridad.setValue(valor);
    this.formulario.controls.prioridad.markAsTouched();
  }

  setIcono(clave: string): void {
    this.formulario.controls.icono.setValue(clave);
    this.formulario.controls.icono.markAsTouched();
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
    const montoInicial = Math.max(0, aNumeroOpcional(v.montoInicial));

    this.metas
      .crear({
        nombre: v.nombre.trim(),
        cantidad_objetivo: Number(v.cantidad),
        monto_inicial: montoInicial,
        prioridad: v.prioridad,
        descripcion: limpiarTexto(v.descripcion),
        icono: v.icono,
        fecha_limite: v.fechaLimite,
      })
      .subscribe({
        next: () => {
          this.enviando.set(false);
          this.creada.emit();
        },
        error: () => {
          this.enviando.set(false);
          this.errorGlobal.set('No se pudo crear la meta. Inténtelo de nuevo.');
        },
      });
  }
}