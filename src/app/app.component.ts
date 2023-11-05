import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/authServ/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'contacts-management';

  constructor(private authServ : AuthService){}
  
  
  ngOnInit(): void {
    this.authServ.autoSignIn();
  }

}

