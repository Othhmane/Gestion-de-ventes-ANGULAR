import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService, Client } from '../clients/clients.service';
import { TransactionService, Transaction } from './transaction.service';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent {
  // Injection des services
  private clientService = inject(ClientService);
  private transactionService = inject(TransactionService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  selectedClient: Client | null = null;
  clientId: number = 0;
  transactionForm: FormGroup;
  showTransactionForm: boolean = false;
  
  // Filtres pour les transactions
  filterType: string = '';
  searchTerm: string = '';

  // Signals pour les données réactives
  clientTransactions = this.transactionService.getClientTransactions(this.clientId);
  clientBalance = this.transactionService.getClientBalance(this.clientId);
  clientStats = this.transactionService.getClientStats(this.clientId);

  constructor() {
    this.transactionForm = this.createTransactionForm();
    this.loadClientFromRoute();
  }

  private loadClientFromRoute(): void {
    const clientIdParam = this.route.snapshot.paramMap.get('id');
    if (clientIdParam) {
      this.clientId = Number(clientIdParam);
      const client = this.clientService.findById(this.clientId);
      
      if (client) {
        this.selectedClient = client;
        // Mettre à jour les signals avec le bon clientId
        this.clientTransactions = this.transactionService.getClientTransactions(this.clientId);
        this.clientBalance = this.transactionService.getClientBalance(this.clientId);
        this.clientStats = this.transactionService.getClientStats(this.clientId);
      } else {
        // Client non trouvé, rediriger vers la liste
        console.log('Client non trouvé avec ID:', this.clientId);
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
      
      const newTransaction = {
        clientId: this.selectedClient.id,
        date: formValue.date,
        type: formValue.type,
        montant: parseFloat(formValue.montant),
        description: formValue.description,
        categorie: formValue.categorie || undefined,
        reference: formValue.reference || undefined
      };

      this.transactionService.add(newTransaction);
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
      this.transactionService.delete(transactionId);
    }
  }

  // ===== CALCULS ET STATISTIQUES (utilisant les signals) =====

  getFilteredTransactions(): Transaction[] {
    let filtered = this.clientTransactions();

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
    return this.clientBalance();
  }

  getTotalEntrees(): number {
    return this.clientStats().totalEntrees;
  }

  getTotalSorties(): number {
    return this.clientStats().totalSorties;
  }

  getTransactionCount(): number {
    return this.clientStats().count;
  }

  getLastTransactionDate(): Date | null {
    return this.clientStats().lastTransactionDate;
  }
}