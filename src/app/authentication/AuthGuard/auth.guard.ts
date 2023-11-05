import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable, take } from 'rxjs';
import { AuthService } from 'src/app/services/authServ/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authServ : AuthService,
              private router : Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree | any{
    
    return this.authServ.user.pipe(
      take(1),
      map(user=>{
        if(user){
          return true;
        }        
          return this.router.createUrlTree(['']);
      })
    )  

  }
  
}
