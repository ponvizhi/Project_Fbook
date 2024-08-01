import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isUserLoggedIn: boolean = false;

  constructor() {
    this.initializeUserSession();
   }

  storeToken(user: any): void{
    sessionStorage.setItem("userInfo", JSON.stringify(user));
    this.isUserLoggedIn = true;
  }

  removeToken(){
    sessionStorage.removeItem("userInfo");
    sessionStorage.removeItem("authUser");
    this.isUserLoggedIn = false;
  }

  fetchToken(){
    return sessionStorage.getItem("userInfo");
  }

  getCurrentUserSession(){
    const userInfo = sessionStorage.getItem('userInfo');
    if (userInfo) {
      this.isUserLoggedIn = true;
      const parsedInfo = JSON.parse(userInfo);
      return parsedInfo.user; // Return the nested user object
    }
    return null;
  }

  //Initialize user session to keep user loggedin on page refresh
  initializeUserSession(){
    const userInfo = sessionStorage.getItem('userInfo');
    this.isUserLoggedIn = !!userInfo;
  } 

  //reset user password session

  storeAuthUserToken(user: any): void{
    sessionStorage.setItem("authUser", JSON.stringify(user));
    this.isUserLoggedIn = true;
  }


  getCurrentAuthUserSession(){
    const authUser = sessionStorage.getItem('authUser');
    if (authUser) {
      this.isUserLoggedIn = true;
      const parsedInfo = JSON.parse(authUser);
      return parsedInfo.user; // Return the nested user object
    }
    return null;
  }
 
}
