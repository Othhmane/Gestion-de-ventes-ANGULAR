import { Routes } from '@angular/router';
import { ClientsComponent } from './features/clients/clients.component';
import { ClientDetailComponent } from './features/clients/client-detail.component';
import { TransactionsComponent } from './features/transactions/transactions.component';
import { AuthGuard } from './auth/auth.guards';
import { AdminGuard } from './auth/admin.guard'; // <--- ajoute ça
import { ClientGuard } from './features/clients/client.guard'; // ← Ajoute ça


// Importe tes composants Login et Register
import { LoginComponent } from './auth/login/login.component'; // <-- Assure-toi du bon chemin

export const routes: Routes = [
  // Routes publiques (accessibles sans être connecté)
  { path: 'login', component: LoginComponent },

  // ✅ Liste des clients (admin seulement)
  {
    path: 'clients',
    component: ClientsComponent,
    canActivate: [AdminGuard] // ← Seul admin peut voir la liste
  },

  // ✅ Transactions d'un client spécifique
  {
    path: 'clients/:id/transactions',
    component: TransactionsComponent,
    canActivate: [ClientGuard] // ← Admin OU client propriétaire
  },

  // ✅ Détail d'un client (admin seulement)
  {
    path: 'clients/:id',
    component: ClientDetailComponent,
    canActivate: [AdminGuard] // ← Seul admin
  },
  
  // Route protégée par AdminGuard
  //{
    //path: 'admin',
    //loadComponent: () =>
     // import('./admin/admin.component').then(m => m.AdminComponent),
   // canActivate: [AdminGuard]   // 🔐 Protégé uniquement admin
 // },

  // Redirection selon le rôle
  {
    path: '',
    redirectTo: '/login', // Tout le monde va d'abord au login
    pathMatch: 'full'
  },

  // Route wildcard pour les chemins non trouvés
  { path: '**', redirectTo: '/login' }
];