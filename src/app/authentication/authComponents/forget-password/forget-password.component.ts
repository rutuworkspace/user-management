import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/authServ/auth.service';
import { ErrorService } from 'src/app/services/errorServ/error.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {

  forgetePassForm! : FormGroup;
  error : boolean = false;
  errorMessage = this.errServ.errorMsgs;
  success: boolean = false; 

  constructor(private fb : FormBuilder,
              private authServ : AuthService,
              private errServ : ErrorService) { }

  ngOnInit(): void {
    this.forgetePassForm = this.fb.group({
      'email' : ['',[Validators.required,Validators.email]]
    })
  }

  get f(){
    return this.forgetePassForm.controls;
  }

  onForgetPassword(){
   if(this.forgetePassForm.valid){
     this.authServ.forgetPassword(this.forgetePassForm.value).subscribe({
      next:(res:any)=>{
        console.log(res);
        this.error = false;
        this.success = true;
      },
      error:(err)=>{
        this.success = false;
        this.error = err;
      }
     })
   }else{
    this.validateAllFormFields(this.forgetePassForm);
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
