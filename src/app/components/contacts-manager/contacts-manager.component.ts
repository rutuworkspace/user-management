import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import { map } from 'rxjs';
import { IContact } from 'src/app/models/cmModels/IContact';
import { AuthService } from 'src/app/services/authServ/auth.service';
import { ContactService } from 'src/app/services/cmServ/contact.service';
import { ErrorService } from 'src/app/services/errorServ/error.service';


@Component({
  selector: 'app-contacts-manager',
  templateUrl: './contacts-manager.component.html',
  styleUrls: ['./contacts-manager.component.scss']
})
export class ContactsManagerComponent implements OnInit {
  faCirclePlus = faCirclePlus;
  faEye = faEye;
  faTrash = faTrash;
  faPen = faPen;

  loading:boolean= false;
  public contacts:IContact[]=[];
  error:any;
  errorMessage = this.errServ.errorMsgs;
  dummyImg = 'https://cdn3.iconfinder.com/data/icons/vector-icons-6/96/256-512.png'
  selectedUser : any;
  profileUser : any;
  firstName:any;
  constructor(private contactServ : ContactService,
              private errServ : ErrorService,
              private authServ : AuthService) {
                this.authServ.profileInfo.subscribe(user=>{
                  this.profileUser = user;
                })
               }

  ngOnInit(): void {
    this.getAllContacts();
  }

  Search(){
    if(this.firstName == ""){
      this.getAllContacts();
    }else{
      this.contacts = this.contacts.filter(res=>{
        return res.name.toLocaleLowerCase().match(this.firstName.toLocaleLowerCase());
      })
    }
  }



  getAllContacts(){
    this.loading = true;
    this.contactServ.getAllContacts().subscribe({
      next:(res:IContact[])=>{
        // console.log(res);
        
        this.contacts = res; 
        // console.log(res[1]);
           
        this.loading = false;   
      },
      error:(err)=>{
        console.log(err);
        
        this.error = err;
        this.loading = false;
      }
    })
  }



  onDeleteContact(contactId:any){
    if(confirm("Are you sure to delete?")){
      this.contactServ.deleteContact(contactId).subscribe({
        next:(res:any)=>{
        this.getAllContacts()      
        },
        error:(err)=>{
          this.error = err;
        }
      })
  }  
}

}
