import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransactionService } from './transaction.service';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="transaction-form-container">
      <div class="form-toggle">
        <button 
          class="toggle-btn" 
          [class.active]="showForm()"
          (click)="toggleForm()"
        >
          <i class="icon-plus"></i>
          {{ showForm() ? 'Masquer' : 'Nouvelle transaction' }}
        </button>
      </div>

      <div class="transaction-form" [class.show]="showForm()">
        <form [formGroup]="transactionForm" (ngSubmit)="addTransaction()" class="form-grid-transaction">
          <div class="form-group">
            <label for="date">Date *</label>
            <input 
              id="date"
              type="date" 
              formControlName="date"
              [class.error]="transactionForm.get('date')?.invalid && transactionForm.get('date')?.touched"
            >
          </div>

          <div class="form-group">
            <label for="type">Type *</label>
            <select 
              id="type"
              formControlName="type"
              [class.error]="transactionForm.get('type')?.invalid && transactionForm.get('type')?.touched"
            >
              <option value="">Sélectionner un type</option>
              <option value="entree">Entrée d'argent (+)</option>
              <option value="sortie">Sortie d'argent (-)</option>
            </select>
          </div>

          <div class="form-group">
            <label for="montant">Montant *</label>
            <input 
              id="montant"
              type="number" 
              step="0.01"
              min="0"
              formControlName="montant"
              placeholder="0.00"
              [class.error]="transactionForm.get('montant')?.invalid && transactionForm.get('montant')?.touched"
            >
          </div>

          <div class="form-group">
            <label for="description">Description *</label>
            <input 
              id="description"
              type="text" 
              formControlName="description"
              placeholder="Ex: Paiement facture, Remboursement..."
              [class.error]="transactionForm.get('description')?.invalid && transactionForm.get('description')?.touched"
            >
          </div>

          <div class="form-group">
            <label for="categorie">Catégorie</label>
            <select 
              id="categorie"
              formControlName="categorie"
            >
              <option value="">Sélectionner une catégorie</option>
              <option value="facture">Facture</option>
              <option value="paiement">Paiement</option>
              <option value="remboursement">Remboursement</option>
              <option value="avance">Avance</option>
              <option value="penalite">Pénalité</option>
              <option value="bonus">Bonus</option>
              <option value="autre">Autre</option>
            </select>
          </div>

          <div class="form-group">
            <label for="reference">Référence</label>
            <input 
              id="reference"
              type="text" 
              formControlName="reference"
              placeholder="Ex: FAC-2024-001"
            >
          </div>

          <div class="form-actions-transaction">
            <button type="button" class="btn-secondary" (click)="resetForm()">
              Annuler
            </button>
            <button type="submit" class="btn-primary" [disabled]="!transactionForm.valid">
              <i class="icon-save"></i>
              Ajouter la transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .transaction-form-container {
      background: white;
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
      border: 1px solid #e2e8f0;
      margin-bottom: 2rem;
      overflow: hidden;
    }

    .form-toggle {
      padding: 1.5rem;
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
    }

    .toggle-btn {
      background: #2563eb;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .toggle-btn:hover {
      background: #1d4ed8;
    }

    .toggle-btn.active {
      background: #ef4444;
    }

    .toggle-btn.active:hover {
      background: #dc2626;
    }

    .transaction-form {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
    }

    .transaction-form.show {
      max-height: 500px;
    }

    .form-grid-transaction {
      padding: 2rem;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      font-weight: 500;
      color: #1e293b;
      font-size: 0.9rem;
    }

    .form-group input,
    .form-group select {
      padding: 0.75rem;
      border: 2px solid #e2e8f0;
      border-radius: 0.5rem;
      font-size: 1rem;
      transition: all 0.2s ease;
    }

    .form-group input:focus,
    .form-group select:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    .form-group input.error,
    .form-group select.error {
      border-color: #ef4444;
      background-color: #fef2f2;
    }

    .form-actions-transaction {
      grid-column: 1 / -1;
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #e2e8f0;
    }

    .btn-primary {
      background: #2563eb;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 500;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s ease;
    }

    .btn-primary:hover {
      background: #1d4ed8;
    }

    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: white;
      color: #64748b;
      border: 1px solid #e2e8f0;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-secondary:hover {
      background: #f1f5f9;
      border-color: #64748b;
    }
  `]
})
export class TransactionFormComponent {
  private fb = inject(FormBuilder);
  private transactionService = inject(TransactionService);

  // Inputs/Outputs
  clientId = input.required<number>();
  showForm = input<boolean>(false);
  formToggled = output<boolean>();
  transactionAdded = output<void>();

  transactionForm: FormGroup;

  constructor() {
    this.transactionForm = this.createTransactionForm();
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

  toggleForm(): void {
    this.formToggled.emit(!this.showForm());
  }

  addTransaction(): void {
    if (this.transactionForm.valid) {
      this.transactionService.add({
        clientId: this.clientId(),
        ...this.transactionForm.value
      });
      
      this.resetForm();
      this.transactionAdded.emit();
    }
  }

  resetForm(): void {
    const today = new Date().toISOString().split('T')[0];
    this.transactionForm.reset({
      date: today,
      type: '',
      montant: 0,
      description: '',
      categorie: '',
      reference: ''
    });
    this.formToggled.emit(false);
  }
}