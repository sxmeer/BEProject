import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { ValidatorloginserviceService } from './validatorloginservice.service';

@Injectable({providedIn: 'root'})
export class ValidatorAuthGuardService implements CanActivate {
  constructor(private loginService: ValidatorloginserviceService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const auth = this.loginService.getAuthentication();
    if (!auth) {
      this.router.navigate(['/validators', 'login']);
    }
    return true;
  }
}