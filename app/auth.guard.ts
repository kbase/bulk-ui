import { Injectable }          from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { KBaseAuth }         from './services/kbase-auth.service';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: KBaseAuth, private router: Router) {}

  canActivate() {
    if (this.authService.isLoggedIn) { return true; }
    this.router.navigate(['/dev-login']);
    return false;
  }
}
