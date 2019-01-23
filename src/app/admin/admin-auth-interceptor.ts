import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler
} from "@angular/common/http";
import { Injectable } from "@angular/core";

import { AdminloginserviceService } from "./adminloginservice.service";

@Injectable()
export class AdminAuthInterceptor implements HttpInterceptor {
  constructor(private loginService: AdminloginserviceService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.loginService.getToken();
    const authRequest = req.clone({
      headers: req.headers.set("Authorization", "Bearer " + authToken)
    });
    return next.handle(authRequest);
  }
}
