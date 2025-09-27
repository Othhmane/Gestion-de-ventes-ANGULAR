import { Routes } from '@angular/router';
import { ClientsComponent } from './features/clients/clients.component';
import { ClientDetailComponent } from './features/clients/client-detail.component';
import { TransactionsComponent } from './features/transactions/transactions.component';
import { LoginComponent } from './auth/login/login.component';

import { AdminGuard } from './auth/admin.guard';
import { ClientGuard } from './features/clients/client.guard';

export const routes: Routes = [
  // 🔓 Routes publiques
  { path: 'login', component: LoginComponent },

  // 🔐 Routes protégées

  // Liste des clients → Admin uniquement
  {
    path: 'clients',
    component: ClientsComponent,
    canActivate: [AdminGuard]
  },

  // Transactions → Admin OU client propriétaire
  {
    path: 'clients/:id/transactions',
    component: TransactionsComponent,
    canActivate: [ClientGuard]
  },

  // Détail d’un client → Admin uniquement
  {
    path: 'clients/:id',
    component: ClientDetailComponent,
    canActivate: [AdminGuard]
  },

  // Redirection défaut → login
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Routes inconnues
  { path: '**', redirectTo: '/login' }
];