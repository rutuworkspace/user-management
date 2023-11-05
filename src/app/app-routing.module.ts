import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './authentication/authComponents/auth/auth.component';
import { ChangePasswordComponent } from './authentication/authComponents/change-password/change-password.component';
import { ForgetPasswordComponent } from './authentication/authComponents/forget-password/forget-password.component';
import { ProfileComponent } from './authentication/authComponents/profile/profile.component';
import { AuthGuard } from './authentication/AuthGuard/auth.guard';
import { CanDeactivateGuard } from './authentication/AuthGuard/can-deactivate.guard';
import { AddContactsComponent } from './components/add-contacts/add-contacts.component';
import { ContactsManagerComponent } from './components/contacts-manager/contacts-manager.component';
import { EditContactsComponent } from './components/edit-contacts/edit-contacts.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ViewContactsComponent } from './components/view-contacts/view-contacts.component';

const routes: Routes = [
  // { path: '', redirectTo: 'auth', pathMatch:'full'},
  { path: '', component: AuthComponent},
  { path: 'contacts/admin', canActivate:[AuthGuard], component: ContactsManagerComponent},
  { path: 'contacts/add' , component: AddContactsComponent},
  { path: 'contacts/edit/:contactId', canDeactivate:[CanDeactivateGuard], component: EditContactsComponent},
  { path: 'contacts/view/:contactId', component: ViewContactsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'forget-password', component: ForgetPasswordComponent },
  { path: '**', component: PageNotFoundComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
