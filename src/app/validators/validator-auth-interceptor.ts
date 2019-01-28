import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ValidatorloginserviceService } from './validatorloginservice.service';

@Injectable()
export class ValidatorAuthInterceptor implements HttpInterceptor {
  constructor(private loginService: ValidatorloginserviceService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.loginService.getToken();
    const authRequest = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + authToken)
    });
    return next.handle(authRequest);
  }
}
