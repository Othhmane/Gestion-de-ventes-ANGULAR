import { Routes } from '@angular/router';

export const CLIENTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./clients.component').then(m => m.ClientsComponent),
    title: 'Gestion des Clients'
  },
  {
    path: ':id',
    loadComponent: () => import('./client-detail.component').then(m => m.ClientDetailComponent),
    title: 'Détail Client'
  },
  {
    path: ':id/transactions',
    loadComponent: () => import('../transactions/transaction-list.component').then(m => m.TransactionListComponent),
    title: 'Transactions Client'
  }
];