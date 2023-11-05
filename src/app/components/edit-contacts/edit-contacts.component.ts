import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot, ParamMap, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CanComponentDeactivate, CanDeactivateGuard } from 'src/app/authentication/AuthGuard/can-deactivate.guard';
import { IContact } from 'src/app/models/cmModels/IContact';
import { ContactService } from 'src/app/services/cmServ/contact.service';
import { ErrorService } from 'src/app/services/errorServ/error.service';

@Component({
  selector: 'app-edit-contacts',
  templateUrl: './edit-contacts.component.html',
  styleUrls: ['./edit-contacts.component.scss']
})
export class EditContactsComponent implements OnInit, CanDeactivateGuard {

  contactForm !: FormGroup;
  public contactId! : any;
  contact : IContact = {} as IContact;
  error:any;
  errorMessage = this.errServ.errorMsgs;
  loading:boolean = false; 
  allContacts : IContact[] =[]
  

  constructor(private activatedRoute : ActivatedRoute,
              private fb : FormBuilder,
              private contactServ : ContactService,
              private router : Router,
              private errServ : ErrorService) { }


  

  ngOnInit(): void {
    this.ongetContact();

    
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

  canDeactivate(component: CanComponentDeactivate, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot | undefined): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    let result = window.confirm("There are unsaved changes! Are you sure ?")
    if(result){
      return true;
    }
    return false;
  }

  get f(){
    return this.contactForm.controls;
  }

  ongetContact(){
    const dataId:any=[];
    this.activatedRoute.paramMap.subscribe({
      next:(param:ParamMap)=>{
        this.contactId = param.get('contactId');
        dataId.push(this.contactId)
      },
      error:(err)=>{
        this.errorMessage = err;
      }
    })

    // this.contactServ.getAllContacts().subscribe(res=>{
    //   this.allContacts = res;
    //   this.loading = true;
    //   this.selectedUser= this.allContacts.filter(g=>dataId.includes(g.userId));
    //   console.log(this.selectedUser);
      
    //   this.loading = false;
      
    // })
    
    this.loading = true;
    this.contactServ.getContact(this.contactId).subscribe({
      next:(res:any)=>{
        this.contact = res;
        this.loading = false;
      },
      error:(err)=>{
        this.error = err;
        this.loading = false;
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

  onEditContact(){
    this.contactServ.updateContact(this.contactForm.value,this.contactId).subscribe({
      next:(res:any)=>{
        this.contactForm.reset();
        this.router.navigate(['/contacts/admin']);       
      },
      error:(err)=>{
        this.errorMessage = err;
        this.router.navigate([`/contacts/edit/${this.contactId}`]).then()
      }
    })
  }


}
