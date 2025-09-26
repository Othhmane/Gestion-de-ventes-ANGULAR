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
    // Charger session depuis le stockage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    }
  }

  login(username: string, password: string): boolean {
    const user = this.users.find(u => u.username === username && u.password === password);
    if (user) {
      this.currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  }

  register(user: { username: string; password: string }): boolean {
    const exists = this.users.find(u => u.username === user.username);
    if (exists) return false;

    // Tous les nouveaux utilisateurs ont le rôle "user"
    const newUser: User = { ...user, role: 'user' };
    this.users.push(newUser);
    return true;
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
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
}