import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, tap} from 'rxjs';
import { AuthResponse } from 'src/app/authentication/appInterface/auth-response.inteface';
import { config } from 'src/app/config/config';
import { User } from 'src/app/models/authModels/user.model';
import { ErrorService } from '../errorServ/error.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //Create Behavior Subject
  user = new BehaviorSubject<User>(null!);
  profileInfo = new BehaviorSubject({
    displayName : '',
    email : '',
    photoUrl : ''
  })

  private tokenExpirationTimer : any;

  constructor(private http : HttpClient,
              private errorServ : ErrorService,
              private router : Router) {}


  //SignUp Method
  signUp(email:any, password:any){
    return this.http.post<AuthResponse>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${config.APY_KEY}`,
    {
      email : email,
      password : password,
      returnSecureToken:true
    }).pipe(catchError(err=>{
      return this.errorServ.handleError(err)
    }),
    tap(res=>{
      this.authenticatedUser(res.email, res.localId, res.idToken, +res.expiresIn)
    })
    )
  }

  //SignIn Method
  signIn(email:any, password:any){
    return this.http.post<AuthResponse>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${config.APY_KEY}`,
    {
      email : email,
      password : password,
      returnSecureToken:true
    }).pipe(catchError(err=>{
      return this.errorServ.handleError(err)
    }),
    tap(res=>{
      this.authenticatedUser(res.email, res.localId, res.idToken, +res.expiresIn)
    })
    )
  }


//Auto Sign In
  autoSignIn(){

    //Get data from localstorage
    const userLoginData  =  JSON.parse(localStorage.getItem('UserData') || '{}');

    // console.log(userLoginData);
    
    //check user login data is available in localstorage or not
    if(!userLoginData){
      return
    }

    //create new user with getting localstorage data
    const loggedInData = new User(userLoginData.email, userLoginData.id, 
                                  userLoginData._token, new Date(userLoginData.tokenExpirationDate));

    //Emitting localstorage data to user Subject 
    if(loggedInData.token){
      this.user.next(loggedInData);

      const expirationDuration = new Date(userLoginData.tokenExpirationDate).getTime() - new Date().getTime();
      this.autoSignOut(expirationDuration) 
      
      //Get Profile User data
    this.getUserData(loggedInData.token);
    }                                 
                                
  }


    //Sign Out
    signOut(){
      this.user.next(null!);
      this.router.navigate(['']);
      localStorage.removeItem('UserData');
     

      if(this.tokenExpirationTimer){
        clearTimeout(this.tokenExpirationTimer);
      }

      this.tokenExpirationTimer = null;
    }


    //auto Sign Out
    autoSignOut(expirationDuration:number){
      this.tokenExpirationTimer = setTimeout(() => {
        this.signOut();
      }, expirationDuration);
    }



  // creating Authenticated user
  private authenticatedUser(email:string, id:string, token:string, expiresIn:any){

    const expirationDate = new Date(new Date().getTime() + expiresIn*1000);
    const userData = new User(email, id, token, expirationDate)
   
    //Emitting above 'userData' into 'user' Subject or Storing data in user subject 
    this.user.next(userData);

    this.autoSignOut(expiresIn*1000);

    //storing data in local storage
    localStorage.setItem('UserData', JSON.stringify(userData));

    //Get Profile User data
    this.getUserData(token);
  }


  //Update Profile
  updateProfile(data:any){

    return this.http.post<any>(`https://identitytoolkit.googleapis.com/v1/accounts:update?key=${config.APY_KEY}`,
    {
      idToken : data.token,
      displayName : data.name,
      photoUrl : data.photoURL,
      returnSecureToken : true
    })
    .pipe(catchError(err=>{
      return this.errorServ.handleError(err)
    }))
  }

  //Get Profile Data
  getUserData(token:any){
    this.http.post<any>(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${config.APY_KEY}`,
    {
      idToken : token
    }).subscribe(res=>{
      this.profileInfo.next({
        displayName : res.users[0].displayName,
        email : res.users[0].email,
        photoUrl : res.users[0].photoUrl
      })
      
    })
  }


  //Change Password
  chnagePassword(data:any){
    return this.http.post<any>(`https://identitytoolkit.googleapis.com/v1/accounts:update?key=${config.APY_KEY}`,
    {
      idToken : data.idToken,
      password : data.password,
      returnSecureToken : true
    }).pipe(catchError(err=>{
      return this.errorServ.handleError(err)
    }))
  }

  
  //Forget Password
  forgetPassword(data:any){
    return this.http.post<any>(`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${config.APY_KEY}`,
    {
      requestType : 'PASSWORD_RESET',
       email : data.email
    }).pipe(catchError(err=>{
      return this.errorServ.handleError(err)
    }))
  }



}
