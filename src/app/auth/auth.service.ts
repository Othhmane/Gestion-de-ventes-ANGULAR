import { Injectable } from '@angular/core';

export interface User {
  username: string;
  password: string;
  role: 'user' | 'admin';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users: User[] = [
    { username: 'admin', password: 'admin', role: 'admin' },
    { username: 'user', password: 'user', role: 'user' }
  ];

  private currentUser: User | null = null;

  constructor() {
    if (this.hasWindow()) {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        this.currentUser = JSON.parse(savedUser);
      }
    }
  }

  login(username: string, password: string): boolean {
    const user = this.users.find(u => u.username === username && u.password === password);
    if (user) {
      this.currentUser = user;
      if (this.hasWindow()) {
        localStorage.setItem('currentUser', JSON.stringify(user));
      }
      return true;
    }
    return false;
  }

  register(user: { username: string; password: string }): boolean {
    const exists = this.users.find(u => u.username === user.username);
    if (exists) return false;

    const newUser: User = { ...user, role: 'user' };
    this.users.push(newUser);
    return true;
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

  // ✅ utilitaire pour éviter l'erreur hors navigateur
  private hasWindow(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
}