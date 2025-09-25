import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService, Transaction } from './transaction.service';
import { ClientService } from '../clients/clients.service';
import { TransactionFormComponent } from './transaction-form.component';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TransactionFormComponent],
  template: `
    <div class="transaction-page" *ngIf="client(); else notFound">
      <div class="page-header">
        <div class="client-info">
          <button class="back-btn" (click)="goBack()">
            <i class="icon-arrow-left"></i>
            Retour
          </button>
          <div class="client-details">
            <h2>{{ client()!.nomEntreprise }}</h2>
            <p>Gestion des crédits et transactions</p>
          </div>
        </div>
        
        <div class="balance-summary">
          <div class="balance-card" [class.positive]="clientBalance() >= 0" [class.negative]="clientBalance() < 0">
            <div class="balance-label">
              {{ clientBalance() >= 0 ? 'Solde créditeur' : 'Solde débiteur' }}
            </div>
            <div class="balance-amount">
              {{ clientBalance() >= 0 ? '+' : '' }}{{ clientBalance() | number:'1.2-2' }}€
            </div>
          </div>
        </div>
      </div>

      <!-- Formulaire d'ajout -->
      <app-transaction-form 
        [clientId]="clientId()"
        [showForm]="showTransactionForm()"
        (formToggled)="showTransactionForm.set($event)"
        (transactionAdded)="onTransactionAdded()"
      />

      <!-- Tableau des transactions -->
      <div class="transactions-table-container">
        <div class="table-header">
          <h3>Historique des transactions</h3>
          <div class="table-filters">
            <select [(ngModel)]="filterType" class="filter-select">
              <option value="">Tous les types</option>
              <option value="entree">Entrées</option>
              <option value="sortie">Sorties</option>
            </select>
            <input 
              type="text" 
              [(ngModel)]="searchTerm" 
              placeholder="Rechercher..." 
              class="search-input"
            >
          </div>
        </div>

        <div class="table-responsive">
          <table class="transactions-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Description</th>
                <th>Catégorie</th>
                <th>Référence</th>
                <th>Montant</th>
                <th>Solde</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let transaction of filteredTransactions()" [class]="transaction.type">
                <td>{{ transaction.date | date:'dd/MM/yyyy' }}</td>
                <td>
                  <span class="type-badge" [class]="transaction.type">
                    {{ transaction.type === 'entree' ? 'Entrée' : 'Sortie' }}
                  </span>
                </td>
                <td>{{ transaction.description }}</td>
                <td>
                  <span class="category-tag" *ngIf="transaction.categorie">
                    {{ transaction.categorie }}
                  </span>
                </td>
                <td>{{ transaction.reference || '-' }}</td>
                <td class="montant" [class]="transaction.type">
                  {{ transaction.type === 'entree' ? '+' : '-' }}{{ transaction.montant | number:'1.2-2' }}€
                </td>
                <td class="solde" [class.positive]="transaction.soldeApres >= 0" [class.negative]="transaction.soldeApres < 0">
                  {{ transaction.soldeApres | number:'1.2-2' }}€
                </td>
                <td>
                  <div class="action-buttons">
                    <button class="btn-edit" (click)="editTransaction(transaction)" title="Modifier">
                      <i class="icon-edit"></i>
                    </button>
                    <button class="btn-delete" (click)="deleteTransaction(transaction.id)" title="Supprimer">
                      <i class="icon-delete"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="empty-state" *ngIf="filteredTransactions().length === 0">
            <div class="empty-icon">📊</div>
            <h4>Aucune transaction</h4>
            <p>Commencez par ajouter votre première transaction pour ce client.</p>
          </div>
        </div>
      </div>

      <!-- Statistiques -->
      <div class="statistics-section">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">💰</div>
            <div class="stat-content">
              <div class="stat-value">{{ clientStats().totalEntrees | number:'1.2-2' }}€</div>
              <div class="stat-label">Total des entrées</div>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">💸</div>
            <div class="stat-content">
              <div class="stat-value">{{ clientStats().totalSorties | number:'1.2-2' }}€</div>
              <div class="stat-label">Total des sorties</div>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">📈</div>
            <div class="stat-content">
              <div class="stat-value">{{ clientStats().count }}</div>
              <div class="stat-label">Nombre de transactions</div>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">📅</div>
            <div class="stat-content">
              <div class="stat-value">
                {{ clientStats().lastTransactionDate | date:'dd/MM/yyyy' }}
              </div>
              <div class="stat-label">Dernière transaction</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ng-template #notFound>
      <div class="not-found">
        <h2>Client non trouvé</h2>
        <button class="btn-primary" (click)="goBack()">Retour à la liste</button>
      </div>
    </ng-template>
  `,
  styles: [`
    .transaction-page {
      padding: 2rem;
      background: #f8fafc;
      min-height: 100vh;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
      border: 1px solid #e2e8f0;
    }

    .client-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .back-btn {
      background: #64748b;
      color: white;
      border: none;
      padding: 0.75rem;
      border-radius: 0.5rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .back-btn:hover {
      background: #475569;
      transform: translateX(-2px);
    }

    .client-details h2 {
      margin: 0;
      color: #1e293b;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .client-details p {
      margin: 0.5rem 0 0 0;
      color: #64748b;
      font-size: 0.9rem;
    }

    .balance-card {
      text-align: right;
      padding: 1.5rem;
      border-radius: 0.75rem;
      min-width: 200px;
    }

    .balance-card.positive {
      background: linear-gradient(135deg, #dcfce7, #bbf7d0);
      border: 1px solid #16a34a;
    }

    .balance-card.positive .balance-amount {
      color: #166534;
    }

    .balance-card.negative {
      background: linear-gradient(135deg, #fef2f2, #fecaca);
      border: 1px solid #dc2626;
    }

    .balance-card.negative .balance-amount {
      color: #991b1b;
    }

    .balance-label {
      font-size: 0.9rem;
      color: #64748b;
      margin-bottom: 0.5rem;
    }

    .balance-amount {
      font-size: 2rem;
      font-weight: 700;
    }

    .transactions-table-container {
      background: white;
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
      border: 1px solid #e2e8f0;
      overflow: hidden;
      margin-bottom: 2rem;
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
    }

    .table-header h3 {
      margin: 0;
      color: #1e293b;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .table-filters {
      display: flex;
      gap: 1rem;
    }

    .filter-select,
    .search-input {
      padding: 0.5rem 0.75rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.375rem;
      font-size: 0.9rem;
    }

    .filter-select:focus,
    .search-input:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
    }

    .search-input {
      min-width: 200px;
    }

    .table-responsive {
      overflow-x: auto;
    }

    .transactions-table {
      width: 100%;
      border-collapse: collapse;
    }

    .transactions-table th {
      background: #f1f5f9;
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      color: #1e293b;
      border-bottom: 1px solid #e2e8f0;
      white-space: nowrap;
    }

    .transactions-table td {
      padding: 1rem;
      border-bottom: 1px solid #f1f5f9;
      vertical-align: middle;
    }

    .transactions-table tr:hover {
      background: #fafafa;
    }

    .type-badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .type-badge.entree {
      background: #dcfce7;
      color: #166534;
    }

    .type-badge.sortie {
      background: #fef2f2;
      color: #991b1b;
    }

    .category-tag {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      background: #e2e8f0;
      color: #64748b;
      border-radius: 0.25rem;
      font-size: 0.75rem;
    }

    .montant {
      font-weight: 600;
      font-family: monospace;
    }

    .montant.entree {
      color: #10b981;
    }

    .montant.sortie {
      color: #ef4444;
    }

    .solde {
      font-weight: 600;
      font-family: monospace;
    }

    .solde.positive {
      color: #10b981;
    }

    .solde.negative {
      color: #ef4444;
    }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .action-buttons button {
      padding: 0.375rem;
      border: none;
      border-radius: 0.25rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-edit {
      background: #fef3c7;
      color: #92400e;
    }

    .btn-edit:hover {
      background: #fde68a;
    }

    .btn-delete {
      background: #fef2f2;
      color: #991b1b;
    }

    .btn-delete:hover {
      background: #fecaca;
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      color: #64748b;
    }

    .empty-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .empty-state h4 {
      margin: 0 0 0.5rem 0;
      color: #1e293b;
    }

    .empty-state p {
      margin: 0;
    }

    .statistics-section {
      background: white;
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
      border: 1px solid #e2e8f0;
      padding: 2rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      background: #f8fafc;
      border-radius: 0.75rem;
      border: 1px solid #e2e8f0;
    }

    .stat-icon {
      font-size: 2rem;
    }

    .stat-content .stat-value {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 0.25rem;
    }

    .stat-content .stat-label {
      font-size: 0.85rem;
      color: #64748b;
    }

    .not-found {
      text-align: center;
      padding: 4rem 2rem;
    }

    .btn-primary {
      background: #2563eb;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-primary:hover {
      background: #1d4ed8;
    }

    @media (max-width: 768px) {
      .transaction-page {
        padding: 1rem;
      }

      .page-header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }

      .balance-card {
        text-align: center;
        min-width: auto;
      }

      .table-header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }

      .table-filters {
        justify-content: stretch;
      }

      .search-input {
        min-width: auto;
        flex: 1;
      }

      .transactions-table {
        font-size: 0.85rem;
      }

      .transactions-table th,
      .transactions-table td {
        padding: 0.5rem;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .stat-card {
        flex-direction: column;
        text-align: center;
        gap: 0.5rem;
      }

      .stat-content .stat-value {
        font-size: 1rem;
      }
    }
  `]
})
export class TransactionListComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private transactionService = inject(TransactionService);
  private clientService = inject(ClientService);

  // Signals
  clientId = signal<number>(0);
  showTransactionForm = signal<boolean>(false);
  filterType = '';
  searchTerm = '';

  // Computed
  client = computed(() => {
    const id = this.clientId();
    return id ? this.clientService.findById(id) : null;
  });

  clientTransactions = computed(() => {
    const id = this.clientId();
    return id ? this.transactionService.getClientTransactions(id)() : [];
  });

  clientBalance = computed(() => {
    const id = this.clientId();
    return id ? this.transactionService.getClientBalance(id)() : 0;
  });

  clientStats = computed(() => {
    const id = this.clientId();
    return id ? this.transactionService.getClientStats(id)() : {
      totalEntrees: 0,
      totalSorties: 0,
      count: 0