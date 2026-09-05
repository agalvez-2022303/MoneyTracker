import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { PlaceholderComponent } from './components/placeholder/placeholder.component';
import { LoginComponent } from './components/login/login.component';
import { soloAutenticadosGuard, soloInvitadosGuard } from './guards/auth.guards';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent, canActivate: [soloInvitadosGuard] },
  { path: 'dashboard', component: PlaceholderComponent, canActivate: [soloAutenticadosGuard] },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];