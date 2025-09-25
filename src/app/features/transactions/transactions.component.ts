import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

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
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent {
  selectedClient: Client | null = null;
  transactionForm: FormGroup;
  showTransactionForm: boolean = false;
  
  // Filtres pour les transactions
  filterType: string = '';
  searchTerm: string = '';

  // Données de démonstration - tu peux les remplacer par un service
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
    },
    {
      id: 3,
      clientId: 2,
      date: '2024-01-10',
      type: 'entree',
      montant: 8000,
      description: 'Contrat maintenance',
      categorie: 'facture',
      reference: 'MAINT-001',
      soldeApres: 8000
    }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.transactionForm = this.createTransactionForm();
    this.loadClientFromRoute();
  }

  private loadClientFromRoute(): void {
    const clientId = this.route.snapshot.paramMap.get('id');
    if (clientId) {
      const client = this.clients.find(c => c.id === parseInt(clientId));
      if (client) {
        this.selectedClient = client;
      } else {
        // Client non trouvé, rediriger vers la liste
        this.router.navigate(['/clients']);
      }
    }
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

  // ===== NAVIGATION =====

  goBack(): void {
    this.router.navigate(['/clients']);
  }

  // ===== GESTION DES TRANSACTIONS =====

  addTransaction(): void {
    if (this.transactionForm.valid && this.selectedClient) {
      const formValue = this.transactionForm.value;
      const currentBalance = this.getClientBalance();
      
      const newTransaction: Transaction = {
        id: Date.now(),
        clientId: this.selectedClient.id,
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
    if (!this.selectedClient) return [];
    return this.transactions
      .filter(t => t.clientId === this.selectedClient!.id)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  getFilteredTransactions(): Transaction[] {
    let filtered = this.getClientTransactions();

    if (this.filterType) {
      filtered = filtered.filter(t => t.type === this.filterType);
    }

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
    if (!this.selectedClient) return;

    const clientTransactions = this.transactions
      .filter(t => t.clientId === this.selectedClient!.id)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let runningBalance = 0;
    clientTransactions.forEach(transaction => {
      runningBalance += transaction.type === 'entree' 
        ? transaction.montant 
        : -transaction.montant;
      transaction.soldeApres = runningBalance;
    });
  }
}