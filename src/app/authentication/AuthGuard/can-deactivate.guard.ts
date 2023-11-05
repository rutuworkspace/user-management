import { Component, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';


export interface CanComponentDeactivate{
  canDeactivate:()=> boolean | Promise<boolean> | Observable<boolean>;  
}

@Injectable({
  providedIn: 'root'
})


export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
  canDeactivate(component: CanComponentDeactivate, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot | undefined): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return component.canDeactivate ?  component.canDeactivate() : true;
  }
 
}
