import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = new BehaviorSubject<boolean>(false);
  public loggedIn$ = this.isLoggedIn.asObservable();

  private users: any[] = []; // stocke les utilisateurs en mémoire

  constructor() { }

register(user: {username: string, password: string, role?: string}) {
  const exists = this.users.find(u => u.username === user.username);
  if (exists) return false;
  this.users.push({ ...user, role: user.role || 'user' }); // Ajoute le rôle
  return true;
}

login(username: string, password: string): boolean {
  const user = this.users.find(u => u.username === username && u.password === password);
  if (user) {
    localStorage.setItem('user', JSON.stringify(user)); // Stocke l'utilisateur avec le rôle
    this.isLoggedIn.next(true);
    return true;
  }
  return false;
}

  logout() {
    this.isLoggedIn.next(false);
  }

  isAdmin(): boolean {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.role === 'admin';
}
}
