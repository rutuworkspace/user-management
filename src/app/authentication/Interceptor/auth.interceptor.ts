import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { exhaustMap, Observable, take } from "rxjs";
import { AuthService } from "src/app/services/authServ/auth.service";



@Injectable()
export class AuthInterceptor implements HttpInterceptor{

    constructor(private authServ : AuthService){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return this.authServ.user.pipe(
            take(1),
            exhaustMap((user:any)=>{
                
                if(!user){
                    return next.handle(req);
                }
                const modifiedReq = req.clone({
                    params : new HttpParams().set('auth', user.token)
                })
                return next.handle(modifiedReq);
            })
        )
   
    }

}