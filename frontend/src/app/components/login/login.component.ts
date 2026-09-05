import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import {
  LucideArrowLeft,
  LucideArrowRight,
  LucideCheck,
  LucideEye,
  LucideEyeOff,
} from '@lucide/angular';
import { AuthService } from '../../services/auth.service';
import { ThreeDShapesComponent } from '../three-d-shapes/three-d-shapes.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ThreeDShapesComponent,
    LucideArrowLeft,
    LucideArrowRight,
    LucideCheck,
    LucideEye,
    LucideEyeOff,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroy = inject(DestroyRef);

  readonly formulario = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  mostrarPassword = false;
  readonly enviando = signal(false);
  readonly error = signal('');

  enviar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.enviando.set(true);
    this.error.set('');
    const { email, password } = this.formulario.getRawValue();

    const sub = this.auth.login(email, password).subscribe({
      next: () => {
        this.enviando.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err: HttpErrorResponse) => {
        this.enviando.set(false);
        if (err.status === 401) {
          this.error.set('Correo o contraseña incorrectos.');
        } else if (typeof err.error === 'string' && err.error) {
          this.error.set(err.error);
        } else if (err.error?.error) {
          this.error.set(err.error.error);
        } else {
          this.error.set('No se pudo conectar con el servidor.');
        }
      },
    });
    this.destroy.onDestroy(() => sub.unsubscribe());
  }
}