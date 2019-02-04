import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { ContributorloginserviceService } from './contributorloginservice.service';

@Injectable({providedIn: 'root'})
export class ContributorAuthGuardService implements CanActivate {
  constructor(private loginService: ContributorloginserviceService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const auth = this.loginService.getAuthentication();
    if (!auth) {
      this.router.navigate(['/contributors', 'login']);
    }
    return true;
  }
}
