import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IGroup } from 'src/app/models/cmModels/IGroup';
import { ContactService } from 'src/app/services/cmServ/contact.service';

@Component({
  selector: 'app-add-contacts',
  templateUrl: './add-contacts.component.html',
  styleUrls: ['./add-contacts.component.scss']
})
export class AddContactsComponent implements OnInit {
  contactForm !: FormGroup;
  public groups : IGroup[] = [] as IGroup[];
  contact :any = [];
  error : any;
  errorMessage:string='';
  
  constructor(private fb : FormBuilder,
              private contactServ : ContactService,
              private router : Router) { }

  ngOnInit(): void {

    //creating form
    this.contactForm = this.fb.group({
      'name' : ['', Validators.required],
      'photo' : ['', Validators.required],
      'email' : ['', Validators.required],
      'mobile' : ['', Validators.required],
      'company' : ['', Validators.required],
      'title' : ['', Validators.required],
      'groupId' : ['']
    })
  }

  get f(){
    return this.contactForm.controls;
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
  
  onCreateContact(){
    if(this.contactForm.valid){
    this.contactServ.createContact(this.contactForm.value).subscribe({
      next:(res:any)=>{
        this.contactForm.reset();
      },
      error:(err)=>{
        this.error = err;
      }
    })
  }else{
    this.validateAllFormFields(this.contactForm);
  }
  }


}
