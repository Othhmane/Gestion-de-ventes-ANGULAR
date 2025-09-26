import { Routes } from '@angular/router';
import { ClientsComponent } from './features/clients/clients.component';
import { ClientDetailComponent } from './features/clients/client-detail.component';
import { TransactionsComponent } from './features/transactions/transactions.component';
import { AuthGuard } from './auth/auth.guards';
import { AdminGuard } from './auth/admin.guard'; // <--- ajoute ça


// Importe tes composants Login et Register
import { LoginComponent } from './auth/login/login.component'; // <-- Assure-toi du bon chemin
import { RegisterComponent } from './auth/register/register.component'; // <-- Assure-toi du bon chemin

export const routes: Routes = [
  // Routes publiques (accessibles sans être connecté)
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Routes protégées par AuthGuard
  {
    path: 'clients',
    component: ClientsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'clients/:id/transactions',
    component: TransactionsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: ':id/transactions',
    component: TransactionsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'clients/:id',
    component: ClientDetailComponent,
    canActivate: [AuthGuard]
  },
  
  // Route protégée par AdminGuard
  {
path: 'admin',
    loadComponent: () =>
      import('./admin/admin.component').then(m => m.AdminComponent),
    canActivate: [AdminGuard]   // 🔐 Protégé uniquement admin
  },
  // Route par défaut
  {
    path: '',
    redirectTo: 'clients', // Redirige vers 'clients' si connecté, sinon AuthGuard redirigera vers 'login'
    pathMatch: 'full'
  },
  // Route wildcard pour les chemins non trouvés (optionnel, mais bonne pratique)
  { path: '**', redirectTo: 'clients' } // Ou vers une page 404
];