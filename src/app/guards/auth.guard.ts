import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {

  constructor(private router: Router) { }

  canLoad() {
    const isAuthenticated = !!(+localStorage.getItem('key'))

    if (isAuthenticated) {
      return true
    } else {
      return false
    }
  }


}
