import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientService, Client } from './clients.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="clients-container">
          <button class="btn-primary" (click)="logout()">
            <i class="icon-"></i> Déconnexion
          </button>
      <div class="header">
        <h1>Gestion des Clients</h1>
          <button class="btn-primary" (click)="showAddForm = !showAddForm">
          <i class="icon-plus"></i>
          {{ showAddForm ? 'Annuler' : 'Nouveau Client' }}
        </button>
        <div class="header-stats">
        </div>
      </div>  
      <!-- Formulaire d'ajout -->
      <div class="form-container" [class.show]="showAddForm">
        <div class="form-card">
          <div class="form-header">
            <h2>Ajouter un nouveau client</h2>
            <span class="form-subtitle">Remplissez les informations ci-dessous</span>
          </div>
          
          <form [formGroup]="clientForm" (ngSubmit)="addClient()" class="client-form">
            <div class="form-grid">
              <!-- Informations entreprise -->
              <div class="form-section">
                <h3 class="section-title">
                  <i class="icon-building"></i>
                  Informations de l'entreprise
                </h3>
                
                <div class="form-group">
                  <label for="nomEntreprise">Nom de l'entreprise *</label>
                  <input 
                    id="nomEntreprise"
                    type="text" 
                    formControlName="nomEntreprise"
                    placeholder="Ex: Dupont SARL"
                    [class.error]="clientForm.get('nomEntreprise')?.invalid && clientForm.get('nomEntreprise')?.touched"
                  >
                  <span class="error-message" *ngIf="clientForm.get('nomEntreprise')?.invalid && clientForm.get('nomEntreprise')?.touched">
                    Le nom de l'entreprise est requis
                  </span>
                </div>
                
                <div class="form-group">
                  <label for="secteurActivite">Secteur d'activité *</label>
                  <select 
                    id="secteurActivite"
                    formControlName="secteurActivite"
                    [class.error]="clientForm.get('secteurActivite')?.invalid && clientForm.get('secteurActivite')?.touched"
                  >
                    <option value="">Sélectionner un secteur</option>
                    <option value="Automobile">Automobile</option>
                    <option value="Chimie">Chimie</option>
                    <option value="Construction">Construction</option>
                    <option value="Informatique">Informatique</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Santé">Santé</option>
                    <option value="Éducation">Éducation</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="siret">SIRET *</label>
                  <input 
                    id="siret"
                    type="text" 
                    formControlName="siret"
                    placeholder="14 chiffres"
                    maxlength="14"
                    [class.error]="clientForm.get('siret')?.invalid && clientForm.get('siret')?.touched"
                  >
                  <span class="error-message" *ngIf="clientForm.get('siret')?.invalid && clientForm.get('siret')?.touched">
                    Le SIRET doit contenir exactement 14 chiffres
                  </span>
                </div>
              </div>

              <!-- Contact -->
              <div class="form-section">
                <h3 class="section-title">
                  <i class="icon-contact"></i>
                  Contact principal
                </h3>
                
                <div class="form-group">
                  <label for="contactNom">Nom du contact *</label>
                  <input 
                    id="contactNom"
                    type="text" 
                    formControlName="contactNom"
                    placeholder="Ex: Jean Dupont"
                    [class.error]="clientForm.get('contactNom')?.invalid && clientForm.get('contactNom')?.touched"
                  >
                </div>

                <div class="form-group">
                  <label for="contactEmail">Email *</label>
                  <input 
                    id="contactEmail"
                    type="email" 
                    formControlName="contactEmail"
                    placeholder="contact@entreprise.com"
                    [class.error]="clientForm.get('contactEmail')?.invalid && clientForm.get('contactEmail')?.touched"
                  >
                  <span class="error-message" *ngIf="clientForm.get('contactEmail')?.invalid && clientForm.get('contactEmail')?.touched">
                    Email invalide
                  </span>
                </div>

                <!-- ✅ NOUVEAU CHAMP MOT DE PASSE -->
                <div class="form-group">
                  <label for="contactPassword">Mot de passe de connexion *</label>
                  <input 
                    id="contactPassword"
                    type="password" 
                    formControlName="contactPassword"
                    placeholder="Mot de passe pour se connecter"
                    [class.error]="clientForm.get('contactPassword')?.invalid && clientForm.get('contactPassword')?.touched"
                  >
                  <span class="help-text">Ce mot de passe permettra au client de se connecter avec son email</span>
                  <span class="error-message" *ngIf="clientForm.get('contactPassword')?.invalid && clientForm.get('contactPassword')?.touched">
                    Le mot de passe est requis (minimum 4 caractères)
                  </span>
                </div>
                
                <div class="form-group">
                  <label for="contactTelephone">Téléphone *</label>
                  <input 
                    id="contactTelephone"
                    type="tel" 
                    formControlName="contactTelephone"
                    placeholder="0123456789"
                    maxlength="10"
                    [class.error]="clientForm.get('contactTelephone')?.invalid && clientForm.get('contactTelephone')?.touched"
                  >
                </div>
              </div>

              <!-- Adresse -->
              <div class="form-section">
                <h3 class="section-title">
                  <i class="icon-location"></i>
                  Adresse
                </h3>
                
                <div class="form-group">
                  <label for="adresse">Adresse *</label>
                  <input 
                    id="adresse"
                    type="text" 
                    formControlName="adresse"
                    placeholder="Ex: 1 rue de Paris"
                    [class.error]="clientForm.get('adresse')?.invalid && clientForm.get('adresse')?.touched"
                  >
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="ville">Ville *</label>
                    <input 
                      id="ville"
                      type="text" 
                      formControlName="ville"
                      placeholder="Ex: Paris"
                      [class.error]="clientForm.get('ville')?.invalid && clientForm.get('ville')?.touched"
                    >
                  </div>
                  
                  <div class="form-group">
                    <label for="codePostal">Code postal *</label>
                    <input 
                      id="codePostal"
                      type="text" 
                      formControlName="codePostal"
                      placeholder="Ex: 75001"
                      maxlength="5"
                      [class.error]="clientForm.get('codePostal')?.invalid && clientForm.get('codePostal')?.touched"
                    >
                  </div>
                </div>

                <div class="form-group">
                  <label for="pays">Pays *</label>
                  <select 
                    id="pays"
                    formControlName="pays"
                    [class.error]="clientForm.get('pays')?.invalid && clientForm.get('pays')?.touched"
                  >
                    <option value="">Sélectionner un pays</option>
                    <option value="France">France</option>
                    <option value="Belgique">Belgique</option>
                    <option value="Suisse">Suisse</option>
                    <option value="Canada">Canada</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="btn-secondary" (click)="cancelForm()">
                Annuler
              </button>
              <button type="submit" class="btn-primary" [disabled]="!clientForm.valid">
                <i class="icon-save"></i>
                Ajouter le client
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Message de succès -->
      <div class="success-message" *ngIf="successMessage" [class.show]="successMessage">
        <i class="icon-check"></i>
        {{ successMessage }}
      </div>

      <!-- Liste des clients -->
      <div class="clients-grid">
        <div class="client-card" *ngFor="let client of clients()" (click)="viewClient(client.id)">
          <div class="card-header">
            <div class="company-info">
              <h3 class="company-name">{{ client.nomEntreprise }}</h3>
              <span class="sector-badge" [attr.data-sector]="client.secteurActivite">
                {{ client.secteurActivite }}
              </span>
            </div>
            <div class="card-menu">
<button class="btn-delete" (click)="deleteClient(client.id); $event.stopPropagation()">
  <i class="icon-trash"></i>
  Supprimer
</button>
            </div>
          </div>

          <div class="card-body">
            <div class="contact-info">
              <div class="contact-item">
                <i class="icon-person"></i>
                <span>{{ client.contactNom }}</span>
              </div>
              <div class="contact-item">
                <i class="icon-email"></i>
                <span>{{ client.contactEmail }}</span>
              </div>
              <div class="contact-item">
                <i class="icon-phone"></i>
                <span>{{ client.contactTelephone }}</span>
              </div>
            </div>

            <div class="address-info">
              <div class="address-item">
                <i class="icon-location"></i>
                <span>{{ client.adresse }}, {{ client.ville }} {{ client.codePostal }}</span>
              </div>
            </div>

            <div class="siret-info">
              <span class="siret-label">SIRET:</span>
              <span class="siret-number">{{ client.siret }}</span>
            </div>
          </div>

          <div class="card-footer">
            <span class="client-id">#{{ client.id }}</span>
            <div class="card-actions">
              <button class="btn-spreadsheet" (click)="openTransactions(client.id); $event.stopPropagation()">
                <i class="icon-spreadsheet"></i>
                Transactions
              </button>


              <button class="btn-details" (click)="viewClient(client.id); $event.stopPropagation()">
                Voir détails
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent {
  private clientService = inject(ClientService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  // Signals
  clients = this.clientService.all;
  totalClients = this.clientService.total;

  // Form
  clientForm: FormGroup;
  showAddForm = false;
  successMessage = '';

  constructor() {
    this.clientForm = this.createClientForm();
  }

  private createClientForm(): FormGroup {
    return this.fb.group({
      nomEntreprise: ['', [Validators.required, Validators.minLength(2)]],
      secteurActivite: ['', Validators.required],
      adresse: ['', [Validators.required, Validators.minLength(5)]],
      ville: ['', [Validators.required, Validators.minLength(2)]],
      codePostal: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      pays: ['', Validators.required],
      contactNom: ['', [Validators.required, Validators.minLength(2)]],
      contactEmail: ['', [Validators.required, Validators.email]],
      contactPassword: ['', [Validators.required, Validators.minLength(4)]],
      contactTelephone: ['', [Validators.required, Validators.pattern(/^0[1-9]\d{8}$/)]],
      siret: ['', [Validators.required, Validators.pattern(/^\d{14}$/)]]
    });
  }

deleteClient(clientId: number): void {
  if (confirm("⚠️ Voulez-vous vraiment supprimer ce client ?")) {
    this.clientService.delete(clientId);

    // Optionnel : message de succès
    this.successMessage = "✅ Client supprimé avec succès !";
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }
}

  addClient(): void {
    if (this.clientForm.valid) {
      const formData = this.clientForm.value;
      
      // ✅ 1. Créer le client dans ton service existant
      const newClient = this.clientService.add(formData);
      console.log('Nouveau client créé avec ID:', newClient.id);

      // ✅ 2. Créer les identifiants de connexion dans AuthService (CORRIGÉ - avec l'ID)
      const authData = {
        id: newClient.id, // ← AJOUT DE L'ID
        name: formData.contactNom,
        email: formData.contactEmail,
        password: formData.contactPassword
      };

      if (this.authService.createClient(authData)) {
        // Succès : client créé + identifiants enregistrés
        this.successMessage = `✅ Client "${formData.nomEntreprise}" créé avec succès ! 
                              Login: ${formData.contactEmail} / ${formData.contactPassword}`;
        
        // Efface le message après 5 secondes
        setTimeout(() => {
          this.successMessage = '';
        }, 5000);

        this.clientForm.reset();
        this.showAddForm = false;
        this.router.navigate(['/clients', newClient.id, 'transactions']);
      } else {
        // Erreur : email déjà existant dans AuthService
        alert('⚠️ Erreur : Cet email existe déjà dans le système de connexion');
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.clientForm.controls).forEach(key => {
      const control = this.clientForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  cancelForm(): void {
    this.clientForm.reset();
    this.showAddForm = false;
    this.successMessage = '';
  }

  viewClient(clientId: number): void {
    this.router.navigate(['/clients', clientId]);
  }

  openTransactions(clientId: number): void {
    this.router.navigate(['/clients', clientId, 'transactions']);
  }

  logout(): void {
  this.authService.logout();
  this.router.navigate(['/login']); // retour à la page de login
}
}