import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './../../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ClientGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedId = +route.paramMap.get('id')!;
    const currentUserId = this.authService.getUserId();

    // ✅ Admin peut tout voir OU client peut voir ses propres transactions
    if (this.authService.isAdmin() || 
        (this.authService.isClient() && expectedId === currentUserId)) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}