import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faThLarge } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/authServ/auth.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  faThLarge = faThLarge;
  faEye = faEye;
  faPen = faPen;
  faPowerOff = faPowerOff;
  profileUser : any;

  isLoggedIn : boolean = false;
  constructor(private authServ : AuthService,
              private router : Router) { }

  ngOnInit(): void {
    
    //Get User Profile Photo
    this.authServ.profileInfo.subscribe(user=>{
      this.profileUser = user;
    })


    //To check the User is LoggedIn
    this.authServ.user.subscribe({
      next:(res)=>{
        if(res){
          this.isLoggedIn = true;
        }else{
          this.isLoggedIn = false;
        }
      },
      error:(err)=>{
          console.log(err);         
      }
    })
  }

  onSignOut(){
    this.authServ.signOut();
  }

}
