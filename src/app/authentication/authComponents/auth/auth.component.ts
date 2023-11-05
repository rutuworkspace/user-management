import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { AuthResponse } from 'src/app/authentication/appInterface/auth-response.inteface';
import { AuthService } from 'src/app/services/authServ/auth.service';
import { ErrorService } from 'src/app/services/errorServ/error.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  authForm !: FormGroup;
  loginMode :boolean= true;
  error:any;
  errorMessage = this.errServ.errorMsgs;
  faEnvelope = faEnvelope;
  faLock = faLock;

  constructor(private fb:FormBuilder,
              private authServ : AuthService,
              private router : Router,
              private errServ: ErrorService) { }

  ngOnInit(): void {

    this.authServ.user.subscribe(user=>{
      if(user){
        this.router.navigate(['/contacts/admin'])
      }
    })
    this.authForm = this.fb.group({
      'email': ['',[Validators.required, Validators.email]],
      'password': ['', [Validators.required, Validators.minLength(4)]]
    })

  }

  get f(){
    return this.authForm.controls;
  }

  onDataSwitch(){
    this.loginMode = !this.loginMode;
  }

  onSubmit(){
    if(this.authForm.valid){
       const email = this.authForm.value.email;
       const password = this.authForm.value.password;

       //Observable Creation
       let authObservable : Observable<AuthResponse>;

       if(this.loginMode){
        authObservable = this.authServ.signIn(email,password)
       }else{
        authObservable = this.authServ.signUp(email, password)
       }

       //common subscription for both SignUp and SignIn
       authObservable.subscribe({
        next:(res:AuthResponse)=>{
            console.log(res);
            this.authForm.reset();
            this.router.navigate(['/contacts/admin']);
        },
        error:(err)=>{
          this.error = err
          ;
        }
      })

    }else{
      this.validateAllFormFields(this.authForm);
    }
  }

  
  onGoogleSignIn(){}
  validateAllFormFields(formGroup: FormGroup) {        
    Object.keys(formGroup.controls).forEach(field => { 
      const control = formGroup.get(field);            
      if (control instanceof FormControl) {             
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {        
        this.validateAllFormFields(control);            
      }
    });
  }

}
