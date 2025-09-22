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

  register(user: {username: string, password: string}) {
    const exists = this.users.find(u => u.username === user.username);
    if (exists) return false;
    this.users.push(user);
    return true;
  }

  login(username: string, password: string) {
    const user = this.users.find(u => u.username === username && u.password === password);
    if (user) {
      this.isLoggedIn.next(true);
      return true;
    }
    return false;
  }

  logout() {
    this.isLoggedIn.next(false);
  }
}
