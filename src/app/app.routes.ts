import { Routes } from '@angular/router';
import { ClientsComponent } from './features/clients/clients.component';
import { ClientDetailComponent } from './features/clients/client-detail.component';
import { TransactionsComponent } from './features/transactions/transactions.component';

export const routes: Routes = [
  {
    path: 'clients',
    component: ClientsComponent
  },
  {
    path: 'clients/:id/transactions',
    component: TransactionsComponent
  },
  {
    path: '',
    redirectTo: 'clients',
    pathMatch: 'full'
  },
  { path: ':id/transactions', component: TransactionsComponent },
  { path: 'clients/:id', component: ClientDetailComponent }
];