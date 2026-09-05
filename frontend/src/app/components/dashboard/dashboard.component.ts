import { Component, DestroyRef, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { LucideLayoutDashboard, LucideLogOut } from '@lucide/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, LucideLayoutDashboard, LucideLogOut],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroy = inject(DestroyRef);

  readonly usuario = this.auth.usuario;
  saliendo = false;

  cerrarSesion(): void {
    if (this.saliendo) return;
    this.saliendo = true;
    const sub = this.auth.logout().subscribe({
      next: () => this.router.navigate(['/']),
      error: () => this.router.navigate(['/']),
    });
    this.destroy.onDestroy(() => sub.unsubscribe());
  }
}