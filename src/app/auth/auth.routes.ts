import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from '../admin/admin.component';
import { AdminGuard } from './admin.guard'; 
import { ClientsComponent } from '../features/clients/clients.component';




export const authRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },
  { path: 'clients', component: ClientsComponent }
];