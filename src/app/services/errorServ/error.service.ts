import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  
  constructor() { }

  handleError(err:HttpErrorResponse){
    if(!err.error || !err.error.error){
      return throwError(()=>this.errorMsgs['UNKNOWN'])
    }else{
      return throwError(()=>this.errorMsgs[err.error.error.message])
    }
  }

  errorMsgs:any = {
    UNKNOWN : 'An Unknown Error is Occured.',
    EMAIL_EXISTS: 'The Email Address is already in use by another account.',
    OPERATION_NOT_ALLOWED : 'Password sign-in is disabled for this Portal.',
    EMAIL_NOT_FOUND : 'There is no user record corresponding to this Email ID.',
    INVALID_PASSWORD : 'The Password is Invalid.',
    TOO_MANY_ATTEMPTS_TRY_LATER: 'We have blocked all requests from this device due to unusual activity. Try again later.',
    USER_DISABLED: 'The user account has been disabled by an administrator.',
  }
}
