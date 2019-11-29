import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  UrlTree,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { OrderCancelOrReturnService } from '../cancel-or-returns.service';

@Injectable({
  providedIn: 'root',
})
export class CancelOrReturnRequestInputGuard implements CanActivate {
  constructor(
    private cancelOrReturnService: OrderCancelOrReturnService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    if (this.cancelOrReturnService.cancelOrReturnRequestInputs) {
      return true;
    } else {
      const urlSegments: string[] = route.url.map(seg => seg.path);
      urlSegments.pop();
      return this.router.parseUrl(urlSegments.join('/'));
    }
  }
}
