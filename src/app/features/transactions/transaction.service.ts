import { Injectable, signal, computed } from '@angular/core';

export interface Transaction {
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

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private transactions = signal<Transaction[]>([
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
      date: '2024-01-25',
      type: 'entree',
      montant: 8000,
      description: 'Paiement contrat maintenance',
      categorie: 'facture',
      reference: 'MAINT-2024-01',
      soldeApres: 8000
    }
  ]);

  all = this.transactions.asReadonly();

  constructor() {
    this.loadFromStorage();
  }

  // ===== Persistance =====
  private loadFromStorage(): void {
    const stored = localStorage.getItem('transactions');
    if (stored) {
      this.transactions.set(JSON.parse(stored));
    } else {
      this.saveToStorage(); // première sauvegarde des transactions mockées
    }
  }

  private saveToStorage(): void {
    localStorage.setItem('transactions', JSON.stringify(this.transactions()));
  }

  // ===== SELECTEURS =====
  getClientTransactions(clientId: number) {
    return computed(() => 
      this.transactions()
        .filter(t => t.clientId === clientId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    );
  }

  getClientBalance(clientId: number) {
    return computed(() => {
      return this.transactions()
        .filter(t => t.clientId === clientId)
        .reduce((balance, transaction) => {
          return transaction.type === 'entree' 
            ? balance + transaction.montant 
            : balance - transaction.montant;
        }, 0);
    });
  }

  getClientStats(clientId: number) {
    return computed(() => {
      const clientTransactions = this.transactions().filter(t => t.clientId === clientId);
      
      return {
        totalEntrees: clientTransactions
          .filter(t => t.type === 'entree')
          .reduce((sum, t) => sum + t.montant, 0),
        totalSorties: clientTransactions
          .filter(t => t.type === 'sortie')
          .reduce((sum, t) => sum + t.montant, 0),
        count: clientTransactions.length,
        lastTransactionDate: clientTransactions.length > 0 
          ? new Date(Math.max(...clientTransactions.map(t => new Date(t.date).getTime())))
          : null
      };
    });
  }

  // ===== CRUD =====
  add(transaction: Omit<Transaction, 'id' | 'soldeApres'>) {
    const currentBalance = this.getClientBalance(transaction.clientId)();
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now(),
      soldeApres: transaction.type === 'entree' 
        ? currentBalance + transaction.montant
        : currentBalance - transaction.montant
    };

    this.transactions.update(list => [...list, newTransaction]);
    this.recalculateBalances(transaction.clientId);
    this.saveToStorage(); // ✅ persistance
    return newTransaction;
  }

  update(id: number, updates: Partial<Transaction>) {
    const transaction = this.transactions().find(t => t.id === id);
    if (!transaction) return;

    this.transactions.update(list => 
      list.map(t => t.id === id ? { ...t, ...updates } : t)
    );
    this.recalculateBalances(transaction.clientId);
    this.saveToStorage(); // ✅ persistance
  }

  delete(id: number) {
    const transaction = this.transactions().find(t => t.id === id);
    if (!transaction) return;

    this.transactions.update(list => list.filter(t => t.id !== id));
    this.recalculateBalances(transaction.clientId);
    this.saveToStorage(); // ✅ persistance
  }

  // recalcul des soldes pour un client donné
  private recalculateBalances(clientId: number): void {
    const clientTransactions = this.transactions()
      .filter(t => t.clientId === clientId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let runningBalance = 0;
    const updatedTransactions = this.transactions().map(transaction => {
      if (transaction.clientId === clientId) {
        const clientTransaction = clientTransactions.find(ct => ct.id === transaction.id);
        if (clientTransaction) {
          runningBalance += transaction.type === 'entree' 
            ? transaction.montant 
            : -transaction.montant;
          return { ...transaction, soldeApres: runningBalance };
        }
      }
      return transaction;
    });

    this.transactions.set(updatedTransactions);
    this.saveToStorage(); // ✅ persistance après recalcul
  }
}