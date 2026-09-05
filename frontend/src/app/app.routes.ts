import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { soloAutenticadosGuard, soloInvitadosGuard } from './guards/auth.guards';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent, canActivate: [soloInvitadosGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [soloAutenticadosGuard] },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];