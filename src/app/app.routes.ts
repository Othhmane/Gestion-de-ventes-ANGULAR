import { Routes } from '@angular/router';
import { ClientsComponent } from './features/clients/clients.component';
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
  }
];