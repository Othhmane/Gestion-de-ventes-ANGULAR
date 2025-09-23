import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';

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

interface Transaction {
  id: number;
  clientId: number;
  date: string;
  type: 'entree' | 'sortie';
  montant: number;
  description: string;
  categorie?: string;
  reference?: string;
  soldeApres: number;
}

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
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

  // Données de démonstration pour les transactions
  transactions: Transaction[] = [
    {
      id: 1,
      clientId: 1,
      date: '2024-01-15',
      type: 'entree',
      montant: 5000,
      description: 'Paiement facture #FAC-001',
      categorie: 'facture',
      reference: 'FAC-001',
      soldeApres: 5000
    },
    {
      id: 2,
      clientId: 1,
      date: '2024-01-20',
      type: 'sortie',
      montant: 1500,
      description: 'Remboursement avance',
      categorie: 'remboursement',
      reference: 'REM-001',
      soldeApres: 3500
    }
  ];

  selectedClient: Client | null = null;
  selectedClientForSpreadsheet: Client | null = null;
  clientForm: FormGroup;
  transactionForm: FormGroup;
  showAddForm: boolean = false;
  showSpreadsheet: boolean = false;
  showTransactionForm: boolean = false;
  
  // Filtres pour les transactions
  filterType: string = '';
  searchTerm: string = '';

  constructor(private fb: FormBuilder) {
    this.clientForm = this.createClientForm();
    this.transactionForm = this.createTransactionForm();
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

  private createTransactionForm(): FormGroup {
    const today = new Date().toISOString().split('T')[0];
    return this.fb.group({
      date: [today, Validators.required],
      type: ['', Validators.required],
      montant: [0, [Validators.required, Validators.min(0.01)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      categorie: [''],
      reference: ['']
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
      
      console.log('Client ajouté avec succès:', newClient);
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

  // ===== GESTION DES FEUILLES DE CALCUL =====

  openSpreadsheet(client: Client): void {
    this.selectedClientForSpreadsheet = client;
    this.showSpreadsheet = true;
    this.showTransactionForm = false;
    this.resetTransactionForm();
  }

  closeSpreadsheet(): void {
    this.showSpreadsheet = false;
    this.selectedClientForSpreadsheet = null;
    this.showTransactionForm = false;
  }

  // ===== GESTION DES TRANSACTIONS =====

  addTransaction(): void {
    if (this.transactionForm.valid && this.selectedClientForSpreadsheet) {
      const formValue = this.transactionForm.value;
      const currentBalance = this.getClientBalance();
      
      const newTransaction: Transaction = {
        id: Date.now(),
        clientId: this.selectedClientForSpreadsheet.id,
        date: formValue.date,
        type: formValue.type,
        montant: parseFloat(formValue.montant),
        description: formValue.description,
        categorie: formValue.categorie || undefined,
        reference: formValue.reference || undefined,
        soldeApres: formValue.type === 'entree' 
          ? currentBalance + parseFloat(formValue.montant)
          : currentBalance - parseFloat(formValue.montant)
      };

      this.transactions.push(newTransaction);
      this.recalculateBalances();
      this.resetTransactionForm();
      this.showTransactionForm = false;

      console.log('Transaction ajoutée:', newTransaction);
    }
  }

  resetTransactionForm(): void {
    const today = new Date().toISOString().split('T')[0];
    this.transactionForm.reset({
      date: today,
      type: '',
      montant: 0,
      description: '',
      categorie: '',
      reference: ''
    });
  }

  editTransaction(transaction: Transaction): void {
    // Logique pour éditer une transaction
    this.transactionForm.patchValue({
      date: transaction.date,
      type: transaction.type,
      montant: transaction.montant,
      description: transaction.description,
      categorie: transaction.categorie || '',
      reference: transaction.reference || ''
    });
    this.showTransactionForm = true;
  }

  deleteTransaction(transactionId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette transaction ?')) {
      const index = this.transactions.findIndex(t => t.id === transactionId);
      if (index > -1) {
        this.transactions.splice(index, 1);
        this.recalculateBalances();
      }
    }
  }

  // ===== CALCULS ET STATISTIQUES =====

  getClientTransactions(): Transaction[] {
    if (!this.selectedClientForSpreadsheet) return [];
    return this.transactions
      .filter(t => t.clientId === this.selectedClientForSpreadsheet!.id)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  getFilteredTransactions(): Transaction[] {
    let filtered = this.getClientTransactions();

    // Filtrer par type
    if (this.filterType) {
      filtered = filtered.filter(t => t.type === this.filterType);
    }

    // Filtrer par terme de recherche
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(term) ||
        t.reference?.toLowerCase().includes(term) ||
        t.categorie?.toLowerCase().includes(term)
      );
    }

    return filtered;
  }

  getClientBalance(): number {
    const transactions = this.getClientTransactions();
    return transactions.reduce((balance, transaction) => {
      return transaction.type === 'entree' 
        ? balance + transaction.montant 
        : balance - transaction.montant;
    }, 0);
  }

  getTotalEntrees(): number {
    return this.getClientTransactions()
      .filter(t => t.type === 'entree')
      .reduce((sum, t) => sum + t.montant, 0);
  }

  getTotalSorties(): number {
    return this.getClientTransactions()
      .filter(t => t.type === 'sortie')
      .reduce((sum, t) => sum + t.montant, 0);
  }

  getTransactionCount(): number {
    return this.getClientTransactions().length;
  }

  getLastTransactionDate(): Date | null {
    const transactions = this.getClientTransactions();
    if (transactions.length === 0) return null;
    
    const sortedTransactions = transactions.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return new Date(sortedTransactions[0].date);
  }

  private recalculateBalances(): void {
    if (!this.selectedClientForSpreadsheet) return;

    const clientTransactions = this.transactions
      .filter(t => t.clientId === this.selectedClientForSpreadsheet!.id)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let runningBalance = 0;
    clientTransactions.forEach(transaction => {
      runningBalance += transaction.type === 'entree' 
        ? transaction.montant 
        : -transaction.montant;
      transaction.soldeApres = runningBalance;
    });
  }

  // ===== MÉTHODES UTILITAIRES =====

  formatSiret(siret: string): string {
    return siret.replace(/(\d{3})(\d{3})(\d{3})(\d{5})/, '$1 $2 $3 $4');
  }

  formatPhone(phone: string): string {
    return phone.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1.$2.$3.$4.$5');
  }

  deleteClient(clientId: number): void {
    const index = this.clients.findIndex(client => client.id === clientId);
    if (index > -1) {
      this.clients.splice(index, 1);
      if (this.selectedClient && this.selectedClient.id === clientId) {
        this.selectedClient = null;
      }
      // Supprimer aussi les transactions associées
      this.transactions = this.transactions.filter(t => t.clientId !== clientId);
    }
  }

  editClient(client: Client): void {
    this.clientForm.patchValue(client);
    this.showAddForm = true;
  }

  private validateSiret(siret: string): boolean {
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