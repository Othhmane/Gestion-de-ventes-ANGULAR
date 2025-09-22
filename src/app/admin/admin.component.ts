import { Component } from '@angular/core';

@Component({
  selector: 'app-admin',
  standalone: true,
  template: `
    <div class="admin-container">
      <h2>Espace administrateur</h2>
      <p>Bienvenue, vous avez accès aux fonctionnalités d’administration.</p>
      <!-- Ajoute ici la gestion des produits, utilisateurs, etc. -->
    </div>
  `,
  styles: [`
    .admin-container {
      padding: 2rem;
      text-align: center;
    }
  `]
})
export class AdminComponent {}