import { Injectable } from '@angular/core';

export interface User {
  id?: number;
  username?: string; // Pour admin
  email?: string;    // Pour clients
  password: string;
  role: 'user' | 'admin';
  name?: string;     // Nom du client
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users: User[] = [
    { id: 1, username: 'admin', password: 'admin', role: 'admin' }
  ];

  private currentUser: User | null = null;

  constructor() {
    if (this.hasWindow()) {
      const savedUsers = localStorage.getItem('users');
      if (savedUsers) {
        this.users = JSON.parse(savedUsers);
      }
      
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        this.currentUser = JSON.parse(savedUser);
      }
    }
  }

login(identifier: string, password: string) {
  // ⚡ Attention : tes admins se connectent avec username, pas email
  const user = this.users.find(
    u =>
      (u.email === identifier || u.username === identifier) &&
      u.password === password
  );

  if (user) {
    this.currentUser = user;     // <-- utiliser currentUser
    this.saveCurrentUser();
    return true;
  }
  return false;
}

getUserId() {
  return this.currentUser?.id;   // <-- utiliser currentUser
}


  // ✅ Création client (sans vérification admin - appelé depuis /clients)
createClient(userData: { id: number; name: string; email: string; password: string }) {
  // Vérifie si l'email existe déjà
  const exists = this.users.find(u => u.email === userData.email);
  if (exists) return false;

  const newClient: User = {
    id: userData.id,          // ⚡ garde le même ID que dans ClientService
    name: userData.name,
    email: userData.email,
    password: userData.password,
    role: 'user'
  };

  this.users.push(newClient);
  this.saveUsers(); // si tu utilises localStorage ou autre
  return true;
}

  getClients(): User[] {
    return this.users.filter(u => u.role === 'user');
  }

logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser'); // si tu stockes en localStorage
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }



  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  // ✅ Méthode isClient (pour client.guard.ts)
  isClient(): boolean {
    return this.currentUser?.role === 'user';
  }


  private getNextId(): number {
    return Math.max(...this.users.map(u => u.id || 0)) + 1;
  }

  private saveUsers(): void {
    if (this.hasWindow()) {
      localStorage.setItem('users', JSON.stringify(this.users));
    }
  }

  private saveCurrentUser(): void {
    if (this.hasWindow() && this.currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    }
  }

  private hasWindow(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
}