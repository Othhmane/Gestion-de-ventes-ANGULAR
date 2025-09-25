// src/app/clients/client-transactions.component.ts
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-client-transactions',
  template: `
    <h2>Transactions du client {{ clientId }}</h2>
    <!-- ici tu ajoutes la logique pour récupérer et afficher les transactions -->
  `
})
export class ClientTransactionsComponent {
  clientId: string | null;

  constructor(private route: ActivatedRoute) {
    this.clientId = this.route.snapshot.paramMap.get('id');
  }
}