import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/authServ/auth.service';
import { ErrorService } from 'src/app/services/errorServ/error.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  changePassForm! : FormGroup;
  success : boolean = false;
  error : any;
  errorMessage = this.errServ.errorMsgs;

  token  =  JSON.parse(localStorage.getItem('UserData') || '{}')._token;

  constructor(private fb : FormBuilder,
              private authServ : AuthService,
              private errServ : ErrorService) { }

  ngOnInit(): void {

    this.changePassForm = this.fb.group({
      'password' : ['',[Validators.required, Validators.pattern]]
    })
  }

  get f(){
    return this.changePassForm.controls;
  }

  onChangePassword(){
    if(this.changePassForm.valid){
      const data = {idToken : this.token, ...this.changePassForm.value};
      this.authServ.chnagePassword(data).subscribe({
        next:(res:any)=>{
          this.success = true;
        },
        error:(err)=>{
          this.error = err;
        }
      })
    }else{
      this.validateAllFormFields(this.changePassForm);
    }
  }

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
