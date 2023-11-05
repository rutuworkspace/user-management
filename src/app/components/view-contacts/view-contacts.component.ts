import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { IContact } from 'src/app/models/cmModels/IContact';
import { ContactService } from 'src/app/services/cmServ/contact.service';
import { ErrorService } from 'src/app/services/errorServ/error.service';

@Component({
  selector: 'app-view-contacts',
  templateUrl: './view-contacts.component.html',
  styleUrls: ['./view-contacts.component.scss']
})
export class ViewContactsComponent implements OnInit {
  faArrowAltCircleLeft = faArrowAltCircleLeft;
  contactId! : any;
  contact : IContact = {} as IContact;
  error:any;
  errorMessage!: string;
  loading:boolean = false; 



  constructor(private activatedRoute : ActivatedRoute,
              private contactServ : ContactService,
              private errServ : ErrorService) { }

  ngOnInit(): void {
    this.getSingleContact();
  }

      getSingleContact(){
          this.activatedRoute.paramMap.subscribe({
            next:(param:ParamMap)=>{
              this.contactId = param.get('contactId')
            },
            error:(err)=>{
              this.errorMessage = err;
            }
          })   
     
          this.loading = true;
          this.contactServ.getContact(this.contactId).subscribe({
            next:(res:any)=>{
              this.contact = res; 
              this.loading = false;
            },
            error:(err)=>{
              this.error = err;
              this.loading =false;
            }
          }) 
     }

  public isNotEmpty(){
    return Object.keys(this.contact).length > 0;
  }

}
