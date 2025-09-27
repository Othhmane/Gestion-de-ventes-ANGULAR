
import { Injectable, signal, computed } from '@angular/core';

export interface Client {
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

@Injectable({ providedIn: 'root' })
export class ClientService {
  private initialClients: Client[] = [
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

  private clients = signal<Client[]>([]);

  // Signals publics (readonly)
  all = this.clients.asReadonly();
  total = computed(() => this.clients().length);
  
  // Computed pour statistiques
  secteurs = computed(() => {
    const secteurCount = this.clients().reduce((acc, client) => {
      acc[client.secteurActivite] = (acc[client.secteurActivite] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return secteurCount;
  });

  constructor() {
    this.loadFromStorage();
  }

  // ===== Persistance =====
  private loadFromStorage(): void {
    const stored = localStorage.getItem('clients');
    if (stored) {
      this.clients.set(JSON.parse(stored));
    } else {
      this.clients.set(this.initialClients); // Si rien en storage → prend tes mocks
      this.saveToStorage();
    }
  }

  private saveToStorage(): void {
    localStorage.setItem('clients', JSON.stringify(this.clients()));
  }

  // ===== CRUD =====
  add(client: Omit<Client, 'id'>) {
    const newClient: Client = { ...client, id: Date.now() }; // ID unique
    this.clients.update(list => [...list, newClient]);
    this.saveToStorage(); // ← sauvegarde
    return newClient;
  }

  update(id: number, updates: Partial<Client>) {
    this.clients.update(list => 
      list.map(client => client.id === id ? { ...client, ...updates } : client)
    );
    this.saveToStorage();
  }

  delete(id: number) {
    this.clients.update(list => list.filter(c => c.id !== id));
    this.saveToStorage();
  }

  findById(id: number) {
    return this.clients().find(c => c.id === id);
  }

  search(term: string) {
    return computed(() => 
      this.clients().filter(client =>
        client.nomEntreprise.toLowerCase().includes(term.toLowerCase()) ||
        client.contactNom.toLowerCase().includes(term.toLowerCase()) ||
        client.secteurActivite.toLowerCase().includes(term.toLowerCase())
      )
    );
  }

  // Validation métier
  validateSiret(siret: string): boolean {
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