import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Users } from 'src/app/models/users.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  title: string;

  logoutMessage : string;

  currentUser: Users | null;

  constructor( private authService : AuthService, private router : Router){
    this.title = "FBOOK";
    this.currentUser = null;
    this.logoutMessage = "Are you sure you want to log out?";
  }

  ngOnInit():void{
    // this.currentUser = this.authService.getCurrentUserSession();
    this.getLoggedInStatus();
  }


  logout(): void{
    this.authService.removeToken();
    alert(this.logoutMessage);
    this.router.navigate(['/login']);
  }

  isAdmin(): boolean {
    //console.log('isAdmin check:', this.currentUser?.isAdmin); // Debug log
    return this.currentUser ? this.currentUser.isAdmin : false;
  }



  getLoggedInStatus(): boolean{
    // return this.currentUser !== null;
    this.currentUser = this.authService.getCurrentUserSession();
    if(this.currentUser && Object.keys(this.currentUser).length>0){
      return true;
    }else{
      return false;
    }
  }

}
