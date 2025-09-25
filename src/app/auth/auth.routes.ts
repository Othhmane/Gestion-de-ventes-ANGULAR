import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AdminComponent } from '../admin/admin.component';
import { adminGuard } from './admin.guard'; 
import { ClientsComponent } from '../features/clients/clients.component';




export const authRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin', component: AdminComponent, canActivate: [adminGuard] },
  { path: 'clients', component: ClientsComponent }
];