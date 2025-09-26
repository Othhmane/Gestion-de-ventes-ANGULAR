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

  login(identifier: string, password: string): boolean {
    const user = this.users.find(u => 
      (u.username === identifier || u.email === identifier) && 
      u.password === password
    );
    
    if (user) {
      this.currentUser = user;
      this.saveCurrentUser();
      return true;
    }
    return false;
  }

  // ✅ Méthode register (pour register.component.ts)
  register(user: { username: string; password: string }): boolean {
    const exists = this.users.find(u => u.username === user.username);
    if (exists) return false;

    const newUser: User = { 
      ...user, 
      role: 'user',
      id: this.getNextId()
    };
    this.users.push(newUser);
    this.saveUsers();
    return true;
  }

  // ✅ Création client (sans vérification admin - appelé depuis /clients)
  createClient(clientData: { id: number; name: string; email: string; password: string }): boolean {
    const exists = this.users.find(u => u.email === clientData.email);
    if (exists) return false;

    const newClient: User = {
      id: clientData.id,
      email: clientData.email,
      password: clientData.password,
      name: clientData.name,
      role: 'user'
    };

    this.users.push(newClient);
    this.saveUsers();
    return true;
  }

  getClients(): User[] {
    return this.users.filter(u => u.role === 'user');
  }

  logout(): void {
    this.currentUser = null;
    if (this.hasWindow()) {
      localStorage.removeItem('currentUser');
    }
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  // ✅ Méthode isClient (pour client.guard.ts)
  isClient(): boolean {
    return this.currentUser?.role === 'user';
  }

  getUserId(): number | null {
    return this.currentUser?.id || null;
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