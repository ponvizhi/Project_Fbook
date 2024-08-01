import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
import { UsersListComponent } from './components/admin/users-list/users-list.component';
import { FriendsListComponent } from './components/friends-list/friends-list.component';
import { NetworkComponent } from './components/network/network.component';
import { loginGuard } from './guards/login.guard';

const routes: Routes = [
  {path: 'login', component:LoginComponent},
  {path: 'register', component:RegisterComponent},
  {path: 'home', component:HomeComponent, canActivate : [loginGuard]},
  {path: 'users', component: UsersListComponent, canActivate : [loginGuard]},
  {path: 'friends', component: FriendsListComponent,  canActivate : [loginGuard]},
  {path: 'network', component: NetworkComponent,  canActivate : [loginGuard]},
  {path: 'settings', component:SettingsComponent,  canActivate : [loginGuard]},
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'reset-password', component: ResetPasswordComponent},
  {path: '', redirectTo: 'home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
