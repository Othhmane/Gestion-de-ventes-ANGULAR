import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService, Client } from './clients.service';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="client-detail-container" *ngIf="client(); else notFound">
      <div class="detail-header">
        <button class="back-btn" (click)="goBack()">
          <i class="icon-arrow-left"></i>
          Retour
        </button>
        <div class="client-info">
          <h1>{{ client()!.nomEntreprise }}</h1>
          <span class="sector-badge" [attr.data-sector]="client()!.secteurActivite">
            {{ client()!.secteurActivite }}
          </span>
        </div>
        <div class="actions">
          <button class="btn-primary" (click)="openTransactions()">
            <i class="icon-spreadsheet"></i>
            Voir les transactions
          </button>
        </div>
      </div>

      <div class="detail-content">
        <div class="detail-card">
          <h3>Informations de l'entreprise</h3>
          <div class="info-grid">
            <div class="info-item">
              <label>Nom de l'entreprise</label>
              <span>{{ client()!.nomEntreprise }}</span>
            </div>
            <div class="info-item">
              <label>Secteur d'activité</label>
              <span>{{ client()!.secteurActivite }}</span>
            </div>
            <div class="info-item">
              <label>SIRET</label>
              <span class="siret">{{ client()!.siret }}</span>
            </div>
          </div>
        </div>

        <div class="detail-card">
          <h3>Adresse</h3>
          <div class="address-block">
            <p>{{ client()!.adresse }}</p>
            <p>{{ client()!.codePostal }} {{ client()!.ville }}</p>
            <p>{{ client()!.pays }}</p>
          </div>
        </div>

        <div class="detail-card">
          <h3>Contact principal</h3>
          <div class="contact-block">
            <div class="contact-item">
              <i class="icon-person"></i>
              <span>{{ client()!.contactNom }}</span>
            </div>
            <div class="contact-item">
              <i class="icon-email"></i>
              <a href="mailto:{{ client()!.contactEmail }}">{{ client()!.contactEmail }}</a>
            </div>
            <div class="contact-item">
              <i class="icon-phone"></i>
              <a href="tel:{{ client()!.contactTelephone }}">{{ client()!.contactTelephone }}</a>
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
    .client-detail-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .detail-header {
      display: flex;
      align-items: center;
      gap: 2rem;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e2e8f0;
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

    .client-info h1 {
      margin: 0;
      color: #1e293b;
      font-size: 2rem;
      font-weight: 600;
    }

    .sector-badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 500;
      margin-top: 0.5rem;
    }

    .detail-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 2rem;
    }

    .detail-card {
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
      border: 1px solid #e2e8f0;
    }

    .detail-card h3 {
      margin: 0 0 1.5rem 0;
      color: #1e293b;
      font-size: 1.25rem;
      font-weight: 600;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #e2e8f0;
    }

    .info-grid {
      display: grid;
      gap: 1rem;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .info-item label {
      font-size: 0.875rem;
      color: #64748b;
      font-weight: 500;
    }

    .info-item span {
      color: #1e293b;
      font-weight: 500;
    }

    .siret {
      font-family: monospace;
      background: #f1f5f9;
      padding: 0.5rem;
      border-radius: 0.25rem;
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
    }

    .contact-item i {
      width: 20px;
      color: #2563eb;
    }

    .contact-item a {
      color: #2563eb;
      text-decoration: none;
    }

    .contact-item a:hover {
      text-decoration: underline;
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
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s ease;
    }

    .btn-primary:hover {
      background: #1d4ed8;
      transform: translateY(-1px);
    }
  `]
})
export class ClientDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private clientService = inject(ClientService);

  private clientId = signal<number>(0);
  client = computed(() => {
    const id = this.clientId();
    return id ? this.clientService.findById(id) : null;
  });

  constructor() {
    this.route.params.subscribe(params => {
      this.clientId.set(+params['id']);
    });
  }

  goBack(): void {
    this.router.navigate(['/clients']);
  }

  openTransactions(): void {
    this.router.navigate(['/clients', this.clientId(), 'transactions']);
  }
}