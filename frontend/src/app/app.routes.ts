import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { PlaceholderComponent } from './components/placeholder/placeholder.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'otro', component: PlaceholderComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];