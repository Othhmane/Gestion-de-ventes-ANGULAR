import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService, User } from '../auth/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';


@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  template: `
    <div class="admin-container">
      <h2>Administration</h2>
      
      <div class="nav-links">
        <a routerLink="/clients">Voir tous les clients</a>
        <button (click)="logout()">Se déconnecter</button>
      </div>
      
      <h3>Créer un nouveau client</h3>
      <form [formGroup]="clientForm" (ngSubmit)="createClient()" class="client-form">
        <div class="form-group">
          <label>Nom :</label>
          <input type="text" formControlName="name" placeholder="Nom du client">
        </div>
        <div class="form-group">
          <label>Email :</label>
          <input type="email" formControlName="email" placeholder="email@exemple.com">
        </div>
        <div class="form-group">
          <label>Mot de passe :</label>
          <input type="password" formControlName="password" placeholder="Mot de passe">
        </div>
        <button type="submit" [disabled]="clientForm.invalid">Créer client</button>
      </form>
      
      <div *ngIf="message" [ngClass]="messageType" class="message">{{ message }}</div>
      
      <h3>Liste des clients ({{ clients.length }})</h3>
      <div *ngIf="clients.length === 0" class="no-clients">
        Aucun client créé pour le moment.
      </div>
      <ul class="clients-list" *ngIf="clients.length > 0">
        <li *ngFor="let client of clients" class="client-item">
          <strong>{{ client.name }}</strong> 
          <span>({{ client.email }})</span>
          <span class="client-id">ID: {{ client.id }}</span>
          <a routerLink="/clients/{{ client.id }}/transactions" class="view-transactions">
            Voir transactions
          </a>
        </li>
      </ul>
    </div>
  `,
  styles: [`
    .admin-container { padding: 20px; max-width: 800px; margin: 0 auto; }
    .nav-links { margin-bottom: 20px; }
    .nav-links a, .nav-links button { margin-right: 10px; padding: 8px 16px; }
    .client-form { background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .form-group { margin-bottom: 15px; }
    .form-group label { display: block; margin-bottom: 5px; font-weight: bold; }
    .form-group input { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
    .message { padding: 10px; border-radius: 4px; margin: 10px 0; }
    .success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
    .error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
    .clients-list { list-style: none; padding: 0; }
    .client-item { 
      background: white; 
      padding: 15px; 
      margin-bottom: 10px; 
      border-radius: 8px; 
      border: 1px solid #ddd;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .client-id { color: #666; font-size: 0.9em; }
    .view-transactions { 
      background: #007bff; 
      color: white; 
      padding: 5px 10px; 
      text-decoration: none; 
      border-radius: 4px; 
    }
    .no-clients { color: #666; font-style: italic; }
  `]
})
export class AdminComponent {
  clientForm: FormGroup;
  clients: User[] = [];
  message = '';
  messageType = '';

  constructor(
    private fb: FormBuilder, 
    private auth: AuthService,
    private router: Router
  ) {
    this.clientForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    
    this.loadClients();
  }

  createClient() {
    const clientData = this.clientForm.value;
    if (this.auth.createClient(clientData)) {
      this.message = `Client "${clientData.name}" créé avec succès ! Il peut se connecter avec ${clientData.email}`;
      this.messageType = 'success';
      this.clientForm.reset();
      this.loadClients();
    } else {
      this.message = 'Erreur : cet email existe déjà';
      this.messageType = 'error';
    }
    
    // Efface le message après 5 secondes
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }

  loadClients() {
    this.clients = this.auth.getClients();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}