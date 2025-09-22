import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Client {
  id: number;
  nomEntreprise: string;
  secteurActivite: string;
  adresse: string;
  ville: string;
  codePostal: string;
  pays: string;
  contactNom: string;
  contactEmail: string;
  contactTelephone: string;
  siret: string;
}

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent {
  clients: Client[] = [
    {
      id: 1,
      nomEntreprise: 'Dupont SARL',
      secteurActivite: 'Automobile',
      adresse: '1 rue de Paris',
      ville: 'Paris',
      codePostal: '75001',
      pays: 'France',
      contactNom: 'Jean Dupont',
      contactEmail: 'dupont@email.com',
      contactTelephone: '0601020304',
      siret: '12345678901234'
    },
    {
      id: 2,
      nomEntreprise: 'Martin Industries',
      secteurActivite: 'Chimie',
      adresse: '2 avenue de Lyon',
      ville: 'Lyon',
      codePostal: '69001',
      pays: 'France',
      contactNom: 'Marie Martin',
      contactEmail: 'martin@email.com',
      contactTelephone: '0604050607',
      siret: '98765432109876'
    },
    {
      id: 3,
      nomEntreprise: 'TechCorp Solutions',
      secteurActivite: 'Informatique',
      adresse: '15 boulevard des Technologies',
      ville: 'Toulouse',
      codePostal: '31000',
      pays: 'France',
      contactNom: 'Pierre Durand',
      contactEmail: 'p.durand@techcorp.fr',
      contactTelephone: '0567891234',
      siret: '45678912345678'
    }
  ];

  selectedClient: Client | null = null;
  clientForm: FormGroup;
  showAddForm: boolean = false;

  constructor(private fb: FormBuilder) {
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
      contactTelephone: ['', [Validators.required, Validators.pattern(/^0[1-9]\d{8}$/)]],
      siret: ['', [Validators.required, Validators.pattern(/^\d{14}$/)]]
    });
  }

  addClient(): void {
    if (this.clientForm.valid) {
      const newClient: Client = {
        ...this.clientForm.value,
        id: Date.now()
      };
      
      this.clients.push(newClient);
      this.clientForm.reset();
      this.showAddForm = false;
      
      // Message de succès (optionnel - vous pouvez ajouter un service de notification)
      console.log('Client ajouté avec succès:', newClient);
    } else {
      // Marquer tous les champs comme touchés pour afficher les erreurs
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

  showDetails(client: Client): void {
    this.selectedClient = client;
  }

  closeDetails(): void {
    this.selectedClient = null;
  }

  cancelForm(): void {
    this.clientForm.reset();
    this.showAddForm = false;
  }

  // Méthode utilitaire pour formater le numéro SIRET
  formatSiret(siret: string): string {
    return siret.replace(/(\d{3})(\d{3})(\d{3})(\d{5})/, '$1 $2 $3 $4');
  }

  // Méthode utilitaire pour formater le téléphone
  formatPhone(phone: string): string {
    return phone.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1.$2.$3.$4.$5');
  }

  // Méthode pour supprimer un client (optionnel)
  deleteClient(clientId: number): void {
    const index = this.clients.findIndex(client => client.id === clientId);
    if (index > -1) {
      this.clients.splice(index, 1);
      if (this.selectedClient && this.selectedClient.id === clientId) {
        this.selectedClient = null;
      }
    }
  }

  // Méthode pour éditer un client (optionnel)
  editClient(client: Client): void {
    this.clientForm.patchValue(client);
    this.showAddForm = true;
    // Vous pourriez ajouter une logique pour différencier l'ajout de l'édition
  }

  // Validation personnalisée pour le SIRET
  private validateSiret(siret: string): boolean {
    // Algorithme de validation SIRET basique
    if (!/^\d{14}$/.test(siret)) {
      return false;
    }
    
    let sum = 0;
    for (let i = 0; i < 14; i++) {
      let digit = parseInt(siret.charAt(i));
      if (i % 2 === 1) {
        digit *= 2;
        if (digit > 9) {
          digit = digit.toString().split('').map(Number).reduce((a, b) => a + b, 0);
        }
      }
      sum += digit;
    }
    
    return sum % 10 === 0;
  }
}