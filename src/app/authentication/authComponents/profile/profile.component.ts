import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/authServ/auth.service';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { ErrorService } from 'src/app/services/errorServ/error.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  
  profileForm !: FormGroup;
  editMode:boolean=false;
  faPen = faPen;
  token  =  JSON.parse(localStorage.getItem('UserData') || '{}')._token;
  error:any;
  errorMessage = this.errServ.errorMsgs;
  profileInfo:any;

  constructor(private fb : FormBuilder,
              private router : Router,
              private activatedRoute : ActivatedRoute,
              private authServ : AuthService,
              private errServ : ErrorService) {}             
               

  ngOnInit(): void {

    this.profileForm = this.fb.group({
      "name" : ['', Validators.required],
      'photoURL' : ['', Validators.required]
    })

    
    this.authServ.profileInfo.subscribe(res=>{
      this.profileInfo = res;
      this.profileForm.setValue({
        name : res.displayName,
        photoURL : res.photoUrl
      })
    })

    this.activatedRoute.queryParamMap.subscribe({
      next:(res:any)=>{
        let qParam = res.get('EditMode')

        if(qParam!= null){
          this.editMode = true
        }else{
          this.editMode = false;
        }
        
      },
      error:(err)=>{
        this.error = err;
      }
    })
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
  
  onSubmit(){

    if(this.profileForm.valid){

      const updatedData = {token:this.token, ...this.profileForm.value};
      
      this.authServ.updateProfile(updatedData).subscribe({
        next:(res:any)=>{
          console.log(res);
          this.authServ.getUserData(this.token)
        },
        error:(err)=>{
          this.error = err;
        }
      })
    }
    
  }

  onDiscard(){
    this.router.navigate([],{queryParams : {EditMode:null}})
  }

}
