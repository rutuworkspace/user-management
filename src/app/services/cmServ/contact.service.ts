import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { IContact } from '../../models/cmModels/IContact';
import { IGroup } from '../../models/cmModels/IGroup';
import { ErrorService } from '../errorServ/error.service';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  
  private serverURL:string = 'https://contacts-management-portal-default-rtdb.firebaseio.com/contacts.json'
  private contactsURL:string = 'https://contacts-management-portal-default-rtdb.firebaseio.com/contacts/'
  private serverGroupsURL:string = 'https://contacts-management-portal-default-rtdb.firebaseio.com/groups.json'
  constructor(private http : HttpClient,
              private errorServ : ErrorService) { }


  //GET All Contacts
  public getAllContacts() : Observable<IContact[]>{
    let dataURL:string = `${this.serverURL}`;
    return this.http.get<IContact[]>(dataURL)
    .pipe(map((resData:IContact[])=>{
      const userArray :any = [];
      for(const key in resData){
        // console.log(key);
        // console.log(resData[key]);
        if(resData.hasOwnProperty(key)){
          userArray.push({
            userId : key,
            ...resData[key]
          })
        }
        
      }
      return userArray;
    }),
    catchError(this.handleError)
    )
  }


  public getContact(contactId:any) : Observable<IContact[]>{
    // let dataURL:string = `${this.serverURL}/${contactId}`;
    let dataURL:string = `${this.contactsURL +contactId+ '.json'}`;
    return this.http.get<IContact[]>(dataURL)
    .pipe((catchError(this.handleError)));
  }


  //Create a Contact
  public createContact(contact:IContact) : Observable<IContact>{
    let dataURL:string = `${this.serverURL}`;
    return this.http.post<IContact>(dataURL,contact)
    .pipe(catchError(this.handleError));
  }

  //Update a Contact
  public updateContact(contact:IContact,contactId:string) : Observable<IContact[]>{
    let dataURL:string = `${this.contactsURL +contactId+ '.json'}`;
    return this.http.put<IContact[]>(dataURL,contact)
    .pipe(catchError(this.handleError));
  }

  //Delete a Contact
  public deleteContact(contactId:IContact) : Observable<IContact>{
    let dataURL:string = `${this.contactsURL +contactId+ '.json'}`;
    return this.http.delete<IContact>(dataURL)
    .pipe(catchError(this.handleError));
  } 

  //GET all Groups
  public getAllGroups() : Observable<IGroup[]>{
    let dataURL:string = `${this.serverGroupsURL}`;
    return this.http.get<IGroup[]>(dataURL)
    .pipe(catchError(this.handleError));
  }

  //GET Single Group
  public getGroup(contact:IContact) : Observable<IGroup>{
    let dataURL:string = `${this.serverGroupsURL}/${contact.groupId}`;
    return this.http.get<IGroup>(dataURL)
    .pipe(catchError(this.handleError));
  }


  //Error Handling
  public handleError(error:HttpErrorResponse){
    let errorMessage:string = '';
    if(error.error instanceof ErrorEvent){
      //client Error
      errorMessage = `Error : ${error.error.message}`
    }else{
      //server error
      errorMessage = `status : ${error.status} \n Message: ${error.message}`;
    }
    return throwError(()=> errorMessage);
  }
}
