import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//FontAwesome
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { ContactsManagerComponent } from './components/contacts-manager/contacts-manager.component';
import { AddContactsComponent } from './components/add-contacts/add-contacts.component';
import { EditContactsComponent } from './components/edit-contacts/edit-contacts.component';
import { ViewContactsComponent } from './components/view-contacts/view-contacts.component';
import { SpinnerComponent } from './layout/spinner/spinner.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ReactiveFormsModule , FormsModule} from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthComponent } from './authentication/authComponents/auth/auth.component'
import { AuthInterceptor } from './authentication/Interceptor/auth.interceptor';
import { ProfileComponent } from './authentication/authComponents/profile/profile.component';
import { ChangePasswordComponent } from './authentication/authComponents/change-password/change-password.component';
import { ForgetPasswordComponent } from './authentication/authComponents/forget-password/forget-password.component';
import { AlertModalComponent } from './shared/alert-modal/alert-modal/alert-modal.component';

 
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ContactsManagerComponent,
    AddContactsComponent,
    EditContactsComponent,
    ViewContactsComponent,
    SpinnerComponent,
    PageNotFoundComponent,
    AuthComponent,
    ProfileComponent,
    ChangePasswordComponent,
    ForgetPasswordComponent,
    AlertModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass : AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
