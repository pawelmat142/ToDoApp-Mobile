import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { UserService } from '../services/user.service';

import { isDevMode } from '@angular/core'
const dev = isDevMode() ? true : false

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(
        public router: Router,
        private userService: UserService,
    ) {}

    canActivate(): boolean {
        console.log('canLoad')
        const result = !!this.userService.user
        if (!result) {
            if (dev) console.log('not authenticated!')
            this.router.navigateByUrl('/users', { replaceUrl: true });
        }
        return result
    }
}