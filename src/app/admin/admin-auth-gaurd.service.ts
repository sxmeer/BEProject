import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { AdminloginserviceService } from './adminloginservice.service';

@Injectable({providedIn: 'root'})
export class AdminAuthGuardService implements CanActivate {
  constructor(private loginService:AdminloginserviceService,private router:Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const auth = this.loginService.getAuthentication();
    if(!auth){
      this.router.navigate(['/admin','login']);
    }
    return true;
  }
}