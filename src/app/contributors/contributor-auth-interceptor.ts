import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ContributorloginserviceService } from './contributorloginservice.service';

@Injectable()
export class ContributorAuthInterceptor implements HttpInterceptor {
  constructor(private loginService: ContributorloginserviceService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.loginService.getToken();
    const authRequest = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + authToken)
    });
    return next.handle(authRequest);
  }
}
